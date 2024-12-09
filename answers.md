Name : Michael\
Date : 09/12/2024

# Basic Questions
**q: Imagine you're building a website that allows users to submit photos. One of the requirements is that each photo must be reviewed by a moderator before it can be published. How would you design the logic for this process? What technologies would you use? Do you have any data structure in mind to support this based on your technology of choice to handle those data?**\
**a: There are 3 possible approach:**

1. Use dual table (SQL), documents (NoSQL) or any data structure to mimic a master-slave relationship. 
   For brevity we're going to name them Table 'Draft' and 'Published' which both holds a picture data,
   (assuming the picture data is stored in url format).
   'Draft' has a one-to-one relationship with 'published' table where published store a duplicates of draft.
   The structure looks like this:

   Draft                 
   - id [pk]                     (int) 
   - image_url                   (string)
   - modified_at                 (timestamp)
   - status                      (enum: modified, approved)
   - published_id [fk]           (fk on both to support bidirectional join)

   Published
    - id [pk]      
    - image_url    
    - modified_at  
    - status       
    - draft_id [fk]

   Now, all image data modifications (eg. editor or in CMS) will be carried out in 'Draft' Table,
   actions like : Insert, Update, Delete; will directly changes the status to 'modified'.
   Finally, to make changes or modification visible to the public, we have to provide approve action where it will take
   the corresponding data and carefuly duplicate it to the published version. The frontend will only display data that is contained inside 'Published'.

   action flow :
   modify 'Draft' -> status set to 'modified' -> approve action (moderator cms) -> copy changes to 'Published'

2. Use Caching mechanism where as we only use one table of this structure:

   Table User 
   - id [pk]            (int)
   - image_url          (string)
   - modified_at        (timestamp)
   - status             (enum: modified, approved)
   - cache              (jsonb)

   The cache will store the latest data before modification in form of json, csv or any other convenient types.
   Now similar to approach #1, the frontend will only consume data from the 'cache', 
   !! however this approach has a caveat:
   it has to be done in a server rendered page context so that it won't be inspectable from browser.

3. Extra risky approach that recent 'strapi' version uses is the utilization of double row mechanism
   for example, a data will have at least one row and maximum two. One is to indicate the draft and another one for published.\
```
    id | uid | Name  |  Image |  modified_at
    0  |  21 | Jon   |   ....     178923334   (Draft)
    1  |  21 | Jon*  |   ....     178923334   (Published)
```

# SQL Questions

q : Write a SQL query that shows me how many customers there are from Germany.\
a : 
```SELECT COUNT(*) as result FROM Customers WHERE Country = "Germany";``` 

q : Write a query that shows me a list of the countries that have the most customers; from most customers to least customers.  Don’t show countries that have less than 5 customers.\
a :
```SELECT * FROM (SELECT COUNT(Country) as `count`, Country FROM Customers GROUP BY Country) ORDER BY `count` DESC; ```

q : Reverse Engineer These Results (tell me the query that we need to write to get these results):\
a : 
```
SELECT * FROM (
    SELECT 
        r.CustomerName, 
        COUNT(*) as `OrderCount`,
        FORMAT(MIN(r.OrderDate), 'yyyy-MM-dd') as FirstOrder,
        FORMAT(MAX(r.OrderDate), 'yyyy-MM-dd') as LastOrder 
    FROM (
        SELECT c.CustomerName, o.OrderDate 
        FROM Customers c 
        LEFT JOIN Orders o
        ON c.CustomerID = o.CustomerID
        ) as r
    GROUP BY r.CustomerName
    ORDER BY r.CustomerName
) ORDER BY OrderCount DESC;
```


# Javascript Typescript Questions

### Runable Link : https://playcode.io/2185890
\
q : Make a javascript or typescript function that converts any string to Title Case.\
a : 
```
function titleCase(word) {
  return word.toLowerCase().split(' ').map((s) => {
    return s[0].toUpperCase() + s.substring(1, s.length);
  }).join(' ')
}

// titleCase("I'm a little tea pot");
// titleCase("I'm a little tea pot");
// titleCase("sHoRt AnD sToUt");
// titleCase("SHORT AND STOUT");
```

q : Create a function that counts the word frequency in this string "Four One two two three Three three four  four   four".  Case insensitive, ignore punctuation.\
a : 
```
function frequencyCount(word) {
  let map = {};
  const match = word.toLowerCase().match(/[a-zA-Z0-9]+/gm);
  for(const w of match) {
    map[w] = map.hasOwnProperty(w) ? map[w] + 1 : 0;
  }
  for(const key of Object.keys(map)){
    console.log(`${key} => ${map[key]}`);
  }
}

//frequencyCount("Four One two two three Three three four  four   four")
```

q : Fix this code, using promises\
a : 
```
function delay(ms) {
  return new Promise((resolve) => {
      setTimeout(resolve, ms)
  })
}
// Refresh console before run these
// delay(1000).then(() => console.log('runs after 1 seconds'));
// delay(2000).then(() => console.log('runs after 2 seconds'));
// delay(3000).then(() => console.log('runs after 3 seconds'));
```

q : Rewrite using Async/Await\
a :  
```
function timeout(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function fetchData(url) {
  await timeout(1000);
  if(!url) return {error : "URL is required", data : null};
  return {error : null, data : `Data from ${url}`};
}

async function processData(data) {
  await timeout(1000);
  if(!data) return { error : "Data is required", data : null };
  return { error: null, data: data.toUpperCase() };
}

async function main() {
  const fetchResult = await fetchData("https://example.com");
  if(fetchResult.error) { 
    console.error("Fetch Error:", fetchResult.error);
    return;
  }
  const processResult = await processData(fetchResult.data);
  if(processResult.error) {
    console.error("Process Error", processResult.error);
    return;
  }
  console.log("Processed Data:", processResult.data);
}

//main();

```


# Vue.js
q: Explain Vue.js reactivity and common issues when tracking changes.\
a: I'm more used to react, but the concept of reactivity is more or less the same.
   whereas reactivity describes UI states that vue.js 'watches' 
   and uses to update it's corresponding DOM element and other elements related to it, from its state. 
   --- In short reactivity: vue watches for UI element changes.

q: Describe data flow between components in a Vue.js app\
a: Data moves from parent component to child component via 'props'.

q: List the most common cause of memory leaks in Vue.js apps and how they can be solved.\
a: i'm not sure by memory leaks as javascript is garbage collected by default, 
   but if what you meant is unmanaged resource, probably vue directive such as v-if or v-else might cause some memoization problem
   or maybe certain data that is created within __mounted()__ lifecycles are not properly destroyed withing __destroy()__\
   however i'm not sure it is memory leaks due to improper data initializations that increases overtime.

q: What have you used for state management\
a: Mostly react state management like jotai or redux, or vuex if with vue (limited exposure)

q: What’s the difference between pre-rendering and server side rendering?\
a: You mean SSG (Static-Site-Generation) and SSR (Server-Side-Rendering) if i may correct ?\
   then SSG/Pre-rendering would be pages that served to users pre-built on the time the code building. (HTML were store statically then served)
   and SSR/Server-Side-Rendering is where pages served at the moment the request is sent, pages freshly built on each request. (no cache were used)


# Web Security Best Practices
- Rate Limit (Backend)
- Password Encryption, preferably RSA (Backend) 
- Token invocation (Backend)
- Token expiration (Backend)
- Sensitive form data obscuring (Frontend)
- Login page enumeration (do not make error obvious) (Backend)
- Access control implementation (backend, frontend)
- SSL protected either to web server or between micro services
- Manage CORS carefully to avoid XSS (reject unauthorized domain)
- scan every potentialy dangerous development leftver (e.g. hardcoded credentials)
- Minify source code to obscure hacker deducing our app logic (Frontend)


# Web Performance Best Practices
- Lazy load (to boost FCP)
- Use pre render or SSG (to boost FCP + SEO)
- Skeleton (to boost CLS)
- Load library asynchronously (to avoid TBT)
- Optimize image sizes and quality on different screen sizes
- Utilize CDN for shorter request jump
- Optimize what content to display on mobile (use less than desktop version)


# Tools
Git                     : 3\
Redis                   : 2\
VSCode / JetBrains?     : 2\
Linux?                  : 3\
AWS                     : 1\                
EC2                     : 1\
Lambda                  : 1\
RDS                     : 1\
Cloudwatch              : 0\
S3                      : 2\
Unit testing            : 3\
Kanban boards?          : 1\


