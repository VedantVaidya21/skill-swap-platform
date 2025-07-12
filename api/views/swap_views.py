from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from api.models import SwapRequest, Feedback
from api.serializers.swap_serializers import (
    SwapRequestSerializer, SwapRequestCreateSerializer, 
    SwapRequestUpdateSerializer, FeedbackSerializer
)

class IsRequesterOrRecipient(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.requester == request.user or obj.recipient == request.user

class SwapRequestListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SwapRequestCreateSerializer
        return SwapRequestSerializer
    
    def get_queryset(self):
        user = self.request.user
        status_filter = self.request.query_params.get('status')
        role_filter = self.request.query_params.get('role', 'all')
        
        if role_filter == 'sent':
            queryset = SwapRequest.objects.filter(requester=user)
        elif role_filter == 'received':
            queryset = SwapRequest.objects.filter(recipient=user)
        else:  # 'all'
            queryset = SwapRequest.objects.filter(
                requester=user
            ) | SwapRequest.objects.filter(
                recipient=user
            )
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-created_at')

class SwapRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SwapRequestSerializer
    permission_classes = [IsAuthenticated, IsRequesterOrRecipient]
    
    def get_queryset(self):
        user = self.request.user
        return SwapRequest.objects.filter(
            requester=user
        ) | SwapRequest.objects.filter(
            recipient=user
        )
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SwapRequestUpdateSerializer
        return SwapRequestSerializer
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != 'pending':
            return Response(
                {"detail": "You can only delete pending swap requests."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if instance.requester != request.user:
            return Response(
                {"detail": "Only the requester can delete a swap request."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

class FeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Feedback.objects.filter(to_user=user) 