from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Profile, UserSkill

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    
    class Meta:
        model = Profile
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'location', 'profile_photo', 'availability', 'is_public')
        read_only_fields = ('id', 'username', 'email')
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        # Update User model fields
        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            user.last_name = user_data['last_name']
        user.save()
        
        # Update Profile model fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

class UserSkillInfoSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    
    class Meta:
        model = UserSkill
        fields = ('id', 'skill_name', 'skill_type', 'proficiency_level')

class UserSearchSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(source='profile.profile_photo', read_only=True)
    location = serializers.CharField(source='profile.location', read_only=True)
    availability = serializers.CharField(source='profile.availability', read_only=True)
    user_skills = UserSkillInfoSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 
                  'profile_photo', 'location', 'availability', 'user_skills')
        read_only_fields = fields 