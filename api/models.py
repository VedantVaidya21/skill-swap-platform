from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    location = models.CharField(max_length=100, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    availability = models.CharField(max_length=255, blank=True, null=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

# Create Profile when User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class UserSkill(models.Model):
    SKILL_TYPE_CHOICES = [
        ('offered', 'Offered'),
        ('wanted', 'Wanted'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='user_skills')
    skill_type = models.CharField(max_length=10, choices=SKILL_TYPE_CHOICES)
    proficiency_level = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'skill', 'skill_type')

    def __str__(self):
        return f"{self.user.username} - {self.skill.name} ({self.skill_type})"

class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    requester_skill = models.ForeignKey(UserSkill, on_delete=models.SET_NULL, null=True, related_name='requester_swaps')
    recipient_skill = models.ForeignKey(UserSkill, on_delete=models.SET_NULL, null=True, related_name='recipient_swaps')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Swap Request from {self.requester.username} to {self.recipient.username} - {self.status}"

class Feedback(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]
    
    swap_request = models.ForeignKey(SwapRequest, on_delete=models.CASCADE, related_name='feedbacks')
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_feedbacks')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_feedbacks')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('swap_request', 'from_user')

    def __str__(self):
        return f"Feedback from {self.from_user.username} to {self.to_user.username} - {self.rating}/5"
