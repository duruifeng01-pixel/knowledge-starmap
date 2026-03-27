import requests
from bs4 import BeautifulSoup

def extract_from_url(url):
    """Route to appropriate extractor based on URL."""
    if 'mp.weixin.qq.com' in url:
        return extract_wechat(url)
    elif 'xiaohongshu.com' in url:
        return extract_xiaohongshu(url)
    elif 'bilibili.com' in url:
        return extract_bilibili(url)
    else:
        return extract_generic(url)

def extract_wechat(url):
    # Use Jina Reader as fallback for WeChat (Scrapling can be used if available)
    jina_url = f'https://r.jina.ai/{url.replace("https://", "")}'
    resp = requests.get(jina_url, timeout=30)
    return {'markdown': resp.text, 'source': 'wechat'}

def extract_xiaohongshu(url):
    # CDP-based extraction (WeChat-like anti-scraping) - placeholder for now
    # In production, use CDP with browser automation
    return {'markdown': '', 'source': 'xiaohongshu', 'note': 'Requires browser automation'}

def extract_bilibili(url):
    # Video page: extract title + subtitle using Jina Reader
    jina_url = f'https://r.jina.ai/{url.replace("https://", "")}'
    resp = requests.get(jina_url, timeout=30)
    return {'markdown': resp.text, 'source': 'bilibili'}

def extract_generic(url):
    # Use Jina Reader as fallback
    jina_url = f'https://r.jina.ai/{url.replace("https://", "")}'
    resp = requests.get(jina_url, timeout=30)
    return {'markdown': resp.text, 'source': 'generic'}