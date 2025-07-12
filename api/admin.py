from django.contrib import admin
from .models import Profile, Skill, UserSkill, SwapRequest, Feedback

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'is_public', 'created_at')
    list_filter = ('is_public',)
    search_fields = ('user__username', 'location')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    search_fields = ('name',)

@admin.register(UserSkill)
class UserSkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'skill_type', 'proficiency_level')
    list_filter = ('skill_type', 'proficiency_level')
    search_fields = ('user__username', 'skill__name')

@admin.register(SwapRequest)
class SwapRequestAdmin(admin.ModelAdmin):
    list_display = ('requester', 'recipient', 'status', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('requester__username', 'recipient__username')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('from_user__username', 'to_user__username')
