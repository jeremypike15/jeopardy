from django.conf.urls import url
from django.contrib import admin
from django.conf.urls.static import static
from django.views.generic import TemplateView

from django.conf import settings
from jeopardy.viewsets import BoardViewSet

urlpatterns = [
	url(r'^play/(?P<pk>[0-9A-Za-z-]{36})/$', TemplateView.as_view(template_name='play.html')),
	url(r'^api/v1/board/(?P<pk>[0-9A-Za-z-]{36})/$', BoardViewSet.as_view({'get':'get'})),
    url(r'^admin/', admin.site.urls),
]  + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)