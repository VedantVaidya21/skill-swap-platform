from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q
from api.models import Skill, UserSkill, User
from api.serializers.skill_serializers import (
    SkillSerializer, UserSkillSerializer, UserSkillCreateSerializer
)
from api.serializers.user_serializers import UserSerializer, UserSearchSerializer

class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.filter(is_approved=True)
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class UserSkillListView(generics.ListCreateAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        skill_type = self.request.query_params.get('type')
        
        queryset = UserSkill.objects.filter(user=user)
        if skill_type:
            queryset = queryset.filter(skill_type=skill_type)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserSkillCreateSerializer
        return UserSkillSerializer

class UserSkillDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserSkill.objects.filter(user=self.request.user)

class UserSearchView(generics.ListAPIView):
    serializer_class = UserSearchSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        skill_query = self.request.query_params.get('q', '')
        if not skill_query:
            return User.objects.none()
        
        # Find users with public profiles who offer the requested skill
        skill_users = User.objects.filter(
            profile__is_public=True,
            user_skills__skill__name__icontains=skill_query,
            user_skills__skill_type='offered'
        ).distinct()
        
        return skill_users 