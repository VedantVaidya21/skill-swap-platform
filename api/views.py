from django.shortcuts import render
from .views.auth_views import RegisterView, LoginView
from .views.profile_views import ProfileView
from .views.skill_views import (
    SkillListView, UserSkillListView, UserSkillDetailView, UserSearchView
)
from .views.swap_views import (
    SwapRequestListCreateView, SwapRequestDetailView,
    FeedbackCreateView, FeedbackListView
)
from .views.admin_views import (
    AdminSkillViewSet, AdminUserViewSet, AdminSwapRequestViewSet, ExportView
)

# Create your views here.
