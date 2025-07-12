from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from django.contrib.auth.models import User
from api.models import Skill, SwapRequest, Feedback
from api.serializers.skill_serializers import SkillSerializer
from api.serializers.swap_serializers import SwapRequestSerializer
from api.serializers.user_serializers import UserSerializer
import csv
from django.http import HttpResponse

class AdminSkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        skill = self.get_object()
        skill.is_approved = True
        skill.save()
        return Response({'status': 'skill approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        skill = self.get_object()
        skill.is_approved = False
        skill.save()
        return Response({'status': 'skill rejected'})

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def ban(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'status': 'user banned'})
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': 'user activated'})

class AdminSwapRequestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SwapRequest.objects.all()
    serializer_class = SwapRequestSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = SwapRequest.objects.all()
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class ExportView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        export_type = request.query_params.get('type', 'users')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{export_type}.csv"'
        
        writer = csv.writer(response)
        
        if export_type == 'users':
            writer.writerow(['ID', 'Username', 'Email', 'Date Joined', 'Last Login', 'Is Active'])
            for user in User.objects.all():
                writer.writerow([
                    user.id, user.username, user.email, 
                    user.date_joined, user.last_login, user.is_active
                ])
                
        elif export_type == 'swaps':
            writer.writerow(['ID', 'Requester', 'Recipient', 'Status', 'Created', 'Updated'])
            for swap in SwapRequest.objects.all():
                writer.writerow([
                    swap.id, swap.requester.username, swap.recipient.username,
                    swap.status, swap.created_at, swap.updated_at
                ])
                
        elif export_type == 'feedback':
            writer.writerow(['ID', 'Swap ID', 'From User', 'To User', 'Rating', 'Created'])
            for feedback in Feedback.objects.all():
                writer.writerow([
                    feedback.id, feedback.swap_request.id, 
                    feedback.from_user.username, feedback.to_user.username,
                    feedback.rating, feedback.created_at
                ])
        
        return response 