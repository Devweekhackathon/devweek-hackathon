import random


def compute_gems(points, num_gems):
    gems = []
    # For each requested gem, fetch a pair of adjacent points from points list and place a gem randomly between them
    start_indices = random.sample(range(0, len(points)-1), int(num_gems))
    start_indices.sort()    # Ensure all gems are in strictly increasing position along the path
    for start_index in start_indices:
        # Find two points between which to place the gem
        start = points[start_index]
        finish = points[start_index+1]

        # Pick the point of the gem
        lat_diff = finish['lat'] - start['lat']
        lng_diff = finish['lng'] - start['lng']
        interspace_position = random.random()       # Pick the gem position 0-1, 0 being start and 1 being finish
        gem_pos = {
            'lat': start['lat'] + lat_diff * interspace_position,
            'lng': start['lng'] + lng_diff * interspace_position
        }

        # Add gem to the gems list
        gems.append(gem_pos)

    return gems


