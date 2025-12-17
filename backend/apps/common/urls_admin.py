from rest_framework.routers import DefaultRouter

from .views import StateOfficeViewSet

router = DefaultRouter()
router.register(r"state-offices", StateOfficeViewSet, basename="state-office")

urlpatterns = router.urls
