from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models import Profile
from api.serializers.user_serializers import ProfileSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile 