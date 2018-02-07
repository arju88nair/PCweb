from django.conf.urls import url
from . import views
from django.conf.urls import (
    handler400, handler403, handler404, handler500
)

urlpatterns = [
    url(r'^$', views.HomePageView.as_view(),name='home'),
    url(r'^about/(?P<title>[\w.@+-]+)/(?P<id>.+?)/?$', views.individualView.as_view(),name='Individual'),
    url(r'^category/(?P<category>.+?)/?$', views.CategoryView.as_view(),name='category'),
    url(r'^source/(?P<source>.+?)$', views.SourceView.as_view(),name='source'),
    url(r'^categoryscroll', views.categoryScroll),
    url(r'^sourcescroll', views.sourceScroll),
    url(r'^search/tag', views.tagSearch.as_view()),
    url(r'^searchcroll', views.searchSroll),
    url(r'^Terms', views.TandC.as_view()),
    url(r'^PrivacyPolicy', views.PrivacyPolicy.as_view()),
    url(r'^byDate/(?P<range>.+?)/$', views.byDate.as_view()),
    url(r'^byDatecroll', views.byDatecroll),
    url(r'^categories', views.Categories.as_view()),
    url(r'^sources', views.Sources.as_view()),
    url(r'^sources', views.Sources.as_view()),
    url(r'^test', views.Test.as_view()),


    url(r'^.*/$', views.Error404.as_view(), name='error404')

]

handler404 = 'views.custom404'
