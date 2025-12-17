from rest_framework.routers import DefaultRouter

from .viewsets import UserAdminViewSet

router = DefaultRouter()
router.register(r"users", UserAdminViewSet, basename="user")

urlpatterns = router.urls
