from django.shortcuts import render,redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from pymongo import MongoClient
import random
from django.core.cache import cache
import pymongo
import logging
from bson.json_util import dumps
from datetime import datetime


now = datetime.now()

# Get an instance of a logger
logging.basicConfig(filename='logger.log', level=logging.DEBUG)
logger = logging.getLogger(__name__)
# Create your views here.


connection = MongoClient('mongodb://localhost:27017/Culminate')
db = connection.Culminate


class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        logging.debug('Home page view for user IP' + request.META['REMOTE_ADDR'])
        popular = popularCall()
        popularBanner = popular[0:2]

        GeneralRes = DBCall(db.General)
        WorldRes = DBCall(db.World)
        India = DBCall(db.India)
        TopBanner = list(db.Main.find({"$and": [{'source': {'$in': ['BBC', 'Independent', 'The Guardian', 'CNN']}},
                                                {"image": {"$exists": True}}]}).skip(10).limit(1).sort("created_at",
                                                                                                       pymongo.DESCENDING))
        EntertainmentRes = DBCall(db.Entertainment)
        PoliticsRes = DBCall(db.Politics)
        ScienceRes = DBCall(db.Science)
        sportsRes = DBCall(db.Sports)
        HealthRes = DBCall(db.Health)
        Technology = DBCall(db.Technology)
        Business = DBCall(db.Business)
        Economy = DBCall(db.Economy)

        context = {
            'generalHeader': GeneralRes[0], 'generalFirstRow': GeneralRes[1:4], 'generalSecondRow': GeneralRes[5:8],
            'worldHeader': WorldRes[1], 'worldFirstRow': WorldRes[2:5], 'worldSecondRow': WorldRes[6:9],
            'Entertainment': EntertainmentRes[0:3],
            'PoliticsHeader1': PoliticsRes[0],
            'PoliticsHeader2': PoliticsRes[1],
            'Politics1': PoliticsRes[2:4],
            'Politics2': PoliticsRes[5:7],
            'ScienceHeader1': ScienceRes[0],
            'ScienceHeader2': ScienceRes[1],
            'Science1': ScienceRes[2:4],
            'Science2': ScienceRes[5:7],
            'Health': HealthRes[0:8],
            'Technology': Technology[0:8],
            'Business': Business[0:6],
            'economyHeader': Economy[0], 'economyFirstRow': Economy[1:4], 'economySecondRow': Economy[5:8],
            'sportsHeader': sportsRes[0], 'sportsFirstRow': sportsRes[1:4], 'sportsSecondRow': sportsRes[5:8],
            'indiaHeader': India[0], 'indiaFirstRow': India[1:4], 'indiaSecondRow': India[5:8],
            'popularBanner': popularBanner,
            'topBanner': TopBanner[0],
            'popular': popular[2:8],


        }

        return render(request, 'index.html', context)


class individualView(TemplateView):
    def get(self, request, **kwargs):
        articleId = self.kwargs['id'];
        articleId=articleId[:16]
        userIp = request.META['REMOTE_ADDR']
        db.PopularPosts.update({'idPost': articleId},
                               {'$addToSet': {'users': userIp}}, upsert=True)
        article = db.Main.find_one({"uTag": articleId})
        similar = list(db.Main.aggregate([
            {
                "$match": {
                    "$text": {
                        "$search": article['title']
                    }
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "image": 1,
                    "link": 1,
                    "source": 1,
                    "category": 1,
                    "published": 1,
                    "created_at": 1,
                    "_id": 1,
                    "score": {
                        "$meta": "textScore"
                    }
                }
            },
            {
                "$match": {
                    "score": {"$gt": 1.0}
                },

            },
            {
                '$limit': 10
            },
            {'$sort': {'score': -1}}
        ]))
        similar = similar[1:10]
        context = {'article': article, 'similar': similar}
        return render(request, 'article.html', context)


def DBCall(collectionName):
    cacheRes = cache.get(collectionName)
    if cacheRes:
        print("Cache")
        return cacheRes
    else:
        print("DB")
        items = list(collectionName.find(
            {"image": {"$exists": True}}).limit(20).sort("created_at", pymongo.DESCENDING))
        random.shuffle(items)
        cache.set(collectionName, items, timeout=10)
        return items


class CategoryView(TemplateView):
    def get(self, request, *args, **kwargs):
        category = self.kwargs['category']
        categoryDet = db.Categories.find({"tag": category})
        items = list(db[category].find(
            {"image": {"$exists": True}}).limit(20).sort("created_at", pymongo.DESCENDING))
        context = {'response': items, 'category': category, 'details': categoryDet}
        return render(request, 'category.html', context)


def categoryScroll(request):
    collectionName = request.GET.get('cat', '')
    count = request.GET.get('page', '')
    items = db[collectionName].find(
        {}).skip(int(count)).limit(20)
    # for titles in items:
    #     array.append(titles['title'])
    # return HttpResponse(dumps(array), content_type='application/json')
    return JsonResponse(dumps(items), safe=False)


def sourceScroll(request):
    source = request.GET.get('source', '')
    count = request.GET.get('page', '')
    items = db.Main.find(
        {'source': source}).skip(int(count)).limit(20)
    return JsonResponse(dumps(items), safe=False)


def searchSroll(request):
    count = request.GET.get('page', '')
    text = request.GET.get('text', '')

    response = list(db.Main.aggregate([
        {
            "$match": {
                "$text": {
                    "$search": text
                }
            }
        },
        {
            "$project": {
                "_id": 1,
                "title": 1,
                "image": 1,
                "link": 1,
                "source": 1,
                "summary": 1,
                "category": 1,
                "published": 1,
                "created_at": 1,
                "_id": 1,
                "score": {
                    "$meta": "textScore"
                }
            }
        },
        {
            "$match": {
                "score": {"$gt": 0.5}
            },

        },
        {
            '$skip': int(count)
        },
        {
            '$limit': 10
        },

        {'$sort': {'score': -1}}
    ]))

    return JsonResponse(dumps(response), safe=False)


class SourceView(TemplateView):
    def get(self, request, *args, **kwargs):
        source = self.kwargs['source']
        items = list(db.Main.find(
            {'source': source}).limit(20).sort("created_at", pymongo.DESCENDING))
        context = {'response': items, 'source': source}
        return render(request, 'source.html', context)


class Error404(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, '404.html')


def custom404(request):
    return render(request, '404.html')


def popularCall():
    cacheRes = cache.get(db.Popular)
    if cacheRes:
        print("FSD")
        return cacheRes
    else:
        print("DFS")
        items = list(db.Popular.find({}).sort("created_at", pymongo.DESCENDING))
        random.shuffle(items)
        cache.set(db.Popular, items, timeout=10)
        return items


class tagSearch(TemplateView):
    def get(self, request, *args, **kwargs):
        text = request.GET.get('text', '')

        response = list(db.Main.aggregate([
            {
                "$match": {
                    "$text": {
                        "$search": text
                    }
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "image": 1,
                    "link": 1,
                    "source": 1,
                    "summary": 1,
                    "category": 1,
                    "published": 1,
                    "created_at": 1,
                    "_id": 1,
                    "score": {
                        "$meta": "textScore"
                    }
                }
            },
            {
                "$match": {
                    "score": {"$gt": 0.5}
                },

            },
            {
                '$limit': 10
            },
            {'$sort': {'score': -1}}
        ]))

        context = {'Text': text, 'response': response}
        return render(request, 'search.html', context)


class TandC(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, 'terms.html')


class PrivacyPolicy(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, 'privacy.html')


class byDate(TemplateView):
    def get(self, request, *args, **kwargs):
        Date = self.kwargs['range']
        response = list(db.Main.find({"published": {'$regex': ".*" + Date + ".*"}}).limit(20).sort("published", -1))
        random.shuffle(response)

        context = {'Date': Date, 'response': response}
        return render(request, 'byDate.html', context)


def byDatecroll(request):
    Date = request.GET.get('date', '')
    count = request.GET.get('page', '')
    items = list(db.Main.find(
        {"published": {'$regex': ".*" + Date + ".*"}}).skip(int(count)).limit(20))
    random.shuffle(items)
    return JsonResponse(dumps(items), safe=False)


class Categories(TemplateView):
    def get(self, request, *args, **kwargs):
        response = db.Categories.find({}).sort('tag', 1)

        context = {'response': response}

        return render(request, 'categories.html', context)


class Sources(TemplateView):
    def get(self, request, *args, **kwargs):
        response = db.Sources.find({}).sort('tag', 1)

        context = {'response': response}

        return render(request, 'sources.html', context)


class Test(TemplateView):
    def get(self, request, *args, **kwargs):
        response = db.Sources.find({}).sort('tag', 1)

        context = {'response': response}

        return render(request, '404.html', context)


def MainApi(request):
    items = db.Main.find({}, {"_id": 0}).limit(20)
    return HttpResponse(dumps(items), content_type='application/json')


def Analytics(request):
    userIp = request.META['REMOTE_ADDR']
    page = request.GET.get('page', '')
    date = now.strftime("%Y-%m-%d %H:%M")
    db.userStats.update({'page': page, 'created_at': date},
                        {'$addToSet': {'users': userIp}}, upsert=True)


def latestNews():

    items = db.Main.find({}).limit(5).sort("created_at", pymongo.DESCENDING)
    return items


def redirectUrl(self, request, *args, **kwargs):
    userIp = request.META['REMOTE_ADDR']
    id = self.kwargs['id']
    url = self.kwargs['url']
    return redirect(url)







