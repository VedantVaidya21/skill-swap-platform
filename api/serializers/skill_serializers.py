from rest_framework import serializers
from api.models import Skill, UserSkill
from .user_serializers import UserSerializer

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'is_approved', 'created_at')
        read_only_fields = ('id', 'is_approved', 'created_at')

class UserSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    
    class Meta:
        model = UserSkill
        fields = ('id', 'user', 'skill', 'skill_name', 'skill_type', 'proficiency_level', 'created_at')
        read_only_fields = ('id', 'created_at')
        
    def validate(self, attrs):
        # Check if the skill already exists for the user with the same type
        user = attrs.get('user')
        skill = attrs.get('skill')
        skill_type = attrs.get('skill_type')
        
        # If updating an existing instance, exclude the current instance from the check
        instance = self.instance
        if instance is None:  # Creating a new instance
            if UserSkill.objects.filter(user=user, skill=skill, skill_type=skill_type).exists():
                raise serializers.ValidationError(f"This skill is already in your {skill_type} skills list.")
        
        return attrs

class UserSkillCreateSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = UserSkill
        fields = ('id', 'skill_name', 'skill_type', 'proficiency_level')
        read_only_fields = ('id',)
    
    def create(self, validated_data):
        user = self.context['request'].user
        skill_name = validated_data.pop('skill_name')
        
        # Get or create the skill
        skill, created = Skill.objects.get_or_create(name=skill_name.lower())
        
        # Check if the user already has this skill with the same type
        skill_type = validated_data.get('skill_type')
        if UserSkill.objects.filter(user=user, skill=skill, skill_type=skill_type).exists():
            raise serializers.ValidationError(f"This skill is already in your {skill_type} skills list.")
        
        # Create the user skill
        user_skill = UserSkill.objects.create(
            user=user,
            skill=skill,
            **validated_data
        )
        
        return user_skill 