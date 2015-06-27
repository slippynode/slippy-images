#!/usr/bin/env pyhton

import requests
import os
from imgurpython.helpers.error import ImgurClientError
from imgurpython import ImgurClient

client_id = "YOUR CLIENT ID"
client_secret = "YOUR CLIENT SECRET"

def make_file_directory():
    if not os.path.exists("./sample-images"):
        os.makedirs("./sample-images")

def get_imgur_links(client_id, client_secret):
    try:
        client = ImgurClient(client_id, client_secret)
    except ImgurClientError:
        get_imgur_links(client_id, client_secret)

    items = client.gallery()
    return [x.link for x in items if x is not None]

def download_file(url):
    local_filename = url.split("/")[-1]
    root, extension = os.path.splitext(local_filename)

    if not extension:
        return

    local_file_path = os.path.join("./sample-images", local_filename)
    request = requests.get(url, stream=True)
    with open(local_file_path, 'wb') as file:
        for chunk in request.iter_content(chunk_size=1024):
            if chunk:
                file.write(chunk)
                file.flush()
    return (url)

if __name__ == "__main__":
    make_file_directory()
    imgur_links = get_imgur_links(client_id, client_secret)
    for link in imgur_links:
        url = download_file(link)
        if url is not None:
            print "GET " + url