from rest_framework import serializers
from api.models import SwapRequest, Feedback, UserSkill
from .user_serializers import UserSerializer

class SwapRequestSerializer(serializers.ModelSerializer):
    requester_username = serializers.CharField(source='requester.username', read_only=True)
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    requester_skill_name = serializers.CharField(source='requester_skill.skill.name', read_only=True)
    recipient_skill_name = serializers.CharField(source='recipient_skill.skill.name', read_only=True)
    
    class Meta:
        model = SwapRequest
        fields = ('id', 'requester', 'recipient', 'requester_username', 'recipient_username',
                  'requester_skill', 'recipient_skill', 'requester_skill_name', 'recipient_skill_name',
                  'status', 'message', 'created_at', 'updated_at')
        read_only_fields = ('id', 'requester', 'created_at', 'updated_at')

class SwapRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SwapRequest
        fields = ('id', 'recipient', 'requester_skill', 'recipient_skill', 'message')
        read_only_fields = ('id',)
        
    def validate(self, attrs):
        requester = self.context['request'].user
        recipient = attrs.get('recipient')
        requester_skill = attrs.get('requester_skill')
        recipient_skill = attrs.get('recipient_skill')
        
        # Check if the requester is the owner of the requester_skill
        if requester_skill.user != requester:
            raise serializers.ValidationError({"requester_skill": "You can only offer your own skills."})
        
        # Check if the recipient is the owner of the recipient_skill
        if recipient_skill.user != recipient:
            raise serializers.ValidationError({"recipient_skill": "You can only request skills from their owner."})
        
        # Check if a similar request already exists
        existing_request = SwapRequest.objects.filter(
            requester=requester,
            recipient=recipient,
            requester_skill=requester_skill,
            recipient_skill=recipient_skill,
            status='pending'
        ).exists()
        
        if existing_request:
            raise serializers.ValidationError("A similar swap request already exists.")
        
        return attrs
    
    def create(self, validated_data):
        validated_data['requester'] = self.context['request'].user
        return super().create(validated_data)

class SwapRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SwapRequest
        fields = ('id', 'status')
        read_only_fields = ('id',)
        
    def validate_status(self, value):
        # Only allow certain status transitions
        user = self.context['request'].user
        
        if self.instance.status == 'pending':
            if value not in ['accepted', 'rejected']:
                raise serializers.ValidationError("You can only accept or reject a pending request.")
            # Only the recipient can accept or reject a request
            if self.instance.recipient != user:
                raise serializers.ValidationError("Only the recipient can accept or reject a request.")
        elif self.instance.status == 'accepted':
            if value not in ['completed']:
                raise serializers.ValidationError("You can only mark an accepted request as completed.")
            # Either requester or recipient can mark as completed
            if self.instance.requester != user and self.instance.recipient != user:
                raise serializers.ValidationError("Only participants in this swap can mark it as completed.")
        else:
            raise serializers.ValidationError("You cannot change the status of this request.")
        
        return value

class FeedbackSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username', read_only=True)
    to_username = serializers.CharField(source='to_user.username', read_only=True)
    
    class Meta:
        model = Feedback
        fields = ('id', 'swap_request', 'from_user', 'to_user', 'from_username', 
                  'to_username', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'from_user', 'to_user', 'created_at')
        
    def validate(self, attrs):
        user = self.context['request'].user
        swap_request = attrs.get('swap_request')
        
        # Check if the swap request is completed
        if swap_request.status != 'completed':
            raise serializers.ValidationError({"swap_request": "You can only provide feedback for completed swaps."})
        
        # Check if the user is part of the swap request
        if user != swap_request.requester and user != swap_request.recipient:
            raise serializers.ValidationError({"swap_request": "You can only provide feedback for your own swaps."})
        
        # Check if the user has already provided feedback
        if Feedback.objects.filter(swap_request=swap_request, from_user=user).exists():
            raise serializers.ValidationError("You have already provided feedback for this swap.")
        
        # Set the from_user and to_user fields
        attrs['from_user'] = user
        attrs['to_user'] = swap_request.recipient if user == swap_request.requester else swap_request.requester
        
        return attrs 