import datetime
now = datetime.datetime.now()
from pcweb.views import popularCall,latestNews


def add_variable_to_context(request):
    popular=popularCall()
    popular=popular[2:8]
    ticker = latestNews()
    return {
        'Day': now.strftime("%A") + " . " + now.strftime("%d") + "." + now.strftime("%B") + "." + now.strftime("%Y"),
        'popular':popular,
        'ticker': ticker

    }
