#event/permissions.py
from rest_framework import permissions


class IsOrganizer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['ORGANIZER', 'ADMIN']