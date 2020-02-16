import os
import redis
import time

ACTORS_TO_START = 2

r = redis.from_url(os.environ.get("REDIS_URL"))


# Delay actor until at least `ACTORS_TO_START` actors register
def wait_on_start(number):
    # Add actor to known list of actors
    r.hset('actors-pos', str(number), 0)
    r.hset('actors-points', str(number), 0)

    # Wait until actors are all present
    actors = []
    while len(actors) < ACTORS_TO_START:
        time.sleep(1)
        actors = r.hgetall('actors-pos')

    # Return starting positions and points of actors
    actors_positions = actors
    actors_points = r.hgetall('actors-points')
    actors = {
        key: {
            "position": actors_positions[key],
            "points": actors_points[key]
        } for key in actors.keys
    }

    return actors


# Update store with points and location of actor, and return those for all actors
def update(number, actor):
    # Update actor values
    r.hset('actors-pos', str(number), actor['position'])
    r.hset('actors-points', str(number), actor['points'])

    # Return positions and points of actors
    actors_positions = r.hgetall('actors-pos')
    actors_points = r.hgetall('actors-points')
    actors = {
        key: {
            "position": actors_positions[key],
            "points": actors_points[key]
        } for key in actors_positions.keys
    }

    return actors



