from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, ProfileView,
    SkillListView, UserSkillListView, UserSkillDetailView, UserSearchView,
    SwapRequestListCreateView, SwapRequestDetailView,
    FeedbackCreateView, FeedbackListView,
    AdminSkillViewSet, AdminUserViewSet, AdminSwapRequestViewSet, ExportView
)

# Create a router for admin viewsets
router = DefaultRouter()
router.register(r'admin/skills', AdminSkillViewSet)
router.register(r'admin/users', AdminUserViewSet)
router.register(r'admin/swaps', AdminSwapRequestViewSet)

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile endpoints
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Skill endpoints
    path('skills/', SkillListView.as_view(), name='skills'),
    path('user-skills/', UserSkillListView.as_view(), name='user-skills'),
    path('user-skills/<int:pk>/', UserSkillDetailView.as_view(), name='user-skill-detail'),
    
    # User search endpoint
    path('users/search/', UserSearchView.as_view(), name='user-search'),
    
    # Swap request endpoints
    path('swaps/', SwapRequestListCreateView.as_view(), name='swaps'),
    path('swaps/<int:pk>/', SwapRequestDetailView.as_view(), name='swap-detail'),
    
    # Feedback endpoints
    path('feedback/', FeedbackCreateView.as_view(), name='feedback-create'),
    path('feedback/received/', FeedbackListView.as_view(), name='feedback-list'),
    
    # Admin export endpoint
    path('admin/export/', ExportView.as_view(), name='admin-export'),
    
    # Include admin router URLs
    path('', include(router.urls)),
] 