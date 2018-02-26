"""mock requests"""
from random import normalvariate, randint
from datetime import datetime, timedelta
from time import sleep
from requests import post

DELAY = 2
LATRANGE = [32.7065053, 0.0007]
LONRANGE = [-117.1614935, 0.001]
ZRANGE = [1, 3]
IDRANGE = [1, 5]
DATERANGE = [0, 43200] #12 hours

GESERVICE = "http://startupsges.bd.esri.com:6180/geoevent/rest/receiver/indoors-features-in-rest"

def random_date():
    """Generate a random datetime between now and 24 hours from now"""
    ctime = datetime.utcnow()
    d_s = randint(DATERANGE[0], DATERANGE[1])
    return ctime + timedelta(seconds=d_s)

def get_feature():
    """get the feature to post to geoevent"""
    lat = normalvariate(LATRANGE[0], LATRANGE[1])
    lon = normalvariate(LONRANGE[0], LONRANGE[1])
    f_z = randint(ZRANGE[0], ZRANGE[1])
    uid = str(randint(IDRANGE[0], IDRANGE[1]))
    sim_time = random_date().isoformat()
    feature = {
        "attributes": {
            "deviceId": uid,
            "buildingId": 99,
            "lat": lat,
            "lon": lon,
            "z": f_z,
            "buildingX":11.2,
            "buildingY":12.3,
            "buildingZ":123.3,
            "timerecordstamp": sim_time
        },
        "geometry": {
            "x": lon,
            "y": lat,
            "z": f_z
        }
    }
    return feature

def post_feature(feature):
    """post the feature to geoevent"""
    req = post(GESERVICE, json=feature)
    if req.status_code < 200 or req.status_code > 299:
        print "Error posting `{0}`".format(feature)
        print req.text
        return False
    return True


if __name__ == "__main__":
    print "Streaming"
    count = 0
    while True:
        try:
            p_f = get_feature()
            post_feature(p_f)
            print "posted: {0}".format(count)
            count += 1
            sleep(DELAY)
        except KeyboardInterrupt:
            break


    print "\nSo Long!"
