function getFeedsFromCookie() {
    const name = 'rssFeeds=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return JSON.parse(cookie.substring(name.length, cookie.length));
        }
    }
    return [];
}

const rssFeeds = getFeedsFromCookie();
if (rssFeeds.length === 0) {
    document.body.innerHTML = '<p><a href="#">Click here to configure your feeds.</a></p>';
} else {
    loadPosts().then(posts => {
        console.log(posts);
    }).catch(error => {
        console.error('Error loading posts:', error);
    });
}

async function fetchRSSFeed(url) {
    const response = await fetch(url, { mode: 'no-cors' });
    const text = await response.text();
    return new window.DOMParser().parseFromString(text, "text/xml");
}

async function loadPosts() {
    const posts = [];
    for (const feed of rssFeeds) {
        const rss = await fetchRSSFeed(feed);
        const items = rss.querySelectorAll('item');
        items.forEach(item => {
            posts.push({
                title: item.querySelector('title').textContent,
                link: item.querySelector('link').textContent,
                description: item.querySelector('description').textContent
            });
        });
    }
    return posts;
}

loadPosts().then(posts => {
    console.log(posts);
}).catch(error => {
    console.error('Error loading posts:', error);
});