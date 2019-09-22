define({ "api": [
  {
    "type": "get",
    "url": "/activities/check",
    "title": "Check new activites",
    "version": "1.0.0",
    "name": "CheckNewActivities",
    "group": "Activities",
    "description": "<p>Check for new Activities.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"timeline\": 4,\n    \"social\": 2,\n    \"collaboration\": 4\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/activity/index.js",
    "groupTitle": "Activities",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/activities/collaboration",
    "title": "Check new collaboration activities",
    "version": "1.2.0",
    "name": "CheckNewCollaboration",
    "group": "Activities",
    "description": "<p>Check for new collaboration activities</p>",
    "filename": "src/routes/activity/index.js",
    "groupTitle": "Activities",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2346\",\n        \"name\": \"user 1\",\n        \"username\": \"user 1\",\n        \"avatar\": \"http://istory/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n        \"email\": \"user1@istory.com\"\n      },\n      \"story\": {\n        \"_id\": \"593f94bd17d85a0e003d3c34\",\n        \"title\": \"Story #1\",\n        \"created\": \"Tue Jun 13 2017 09:31:09 GMT+0200 (Central European Summer Time)\"\n      },\n      \"collaborator\": {\n        \"_id\": \"5a538361ea64260e00eb7546\",\n        \"name\": \"user 2\",\n        \"username\": \"user 2\",\n        \"avatar\": null,\n        \"email\": \"user2@istory.com\"\n      },\n      \"type\": \"collaboration_removed\",\n      \"created\": \"Wed Jul 11 2018 14:56:09 GMT+0200 (Central European Summer Time)\"\n    }],\n    \"total\": 4,\n    \"limit\": 1,\n    \"page\": 1,\n    \"pages\": 4\n  }\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/activities/comments",
    "title": "Check new comments",
    "version": "1.2.0",
    "name": "CheckNewComments",
    "group": "Activities",
    "description": "<p>Check for new Comments</p>",
    "filename": "src/routes/activity/index.js",
    "groupTitle": "Activities",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"timelineComments\": {\n      \"total\": 1\n    },\n    \"newSocialComments\": {\n      \"total\": 3\n    },\n    \"newCollaborationComments\": {\n      \"total\": 0\n    },\n  }\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/activities/followers",
    "title": "Check new followers",
    "version": "1.2.0",
    "name": "CheckNewFollowers",
    "group": "Activities",
    "description": "<p>Check for new Followers</p>",
    "filename": "src/routes/activity/index.js",
    "groupTitle": "Activities",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n        \"_id\": \"58eb78b94b432a21008c2347\",\n        \"name\": \"Test Author1\",\n        \"username\": \"testauthor1\",\n        \"avatar\": \"\",\n        \"email\": \"testauthor1@istoryapp.com\"\n      },\n      {\n        \"_id\": \"58eb78b94b432a21008c2348\",\n        \"name\": \"Test Author2\",\n        \"username\": \"testauthor2\",\n        \"avatar\": \"\",\n        \"email\": \"testauthor2@istoryapp.com\"\n      },\n    ],\n    \"total\": 2,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/activities/invites",
    "title": "Check new invites",
    "version": "1.2.0",
    "name": "CheckNewInvites",
    "group": "Activities",
    "description": "<p>Check for new collaboration invites</p>",
    "filename": "src/routes/activity/index.js",
    "groupTitle": "Activities",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"author\": {\n        \"_id\": \"5a538361ea64260e00eb7547\",\n        \"name\": \"Family Member 1\",\n        \"username\": \"family1\",\n        \"avatar\": null,\n        \"email\": \"family1@istoryapp.com\"\n      },\n      \"invited\": {\n        \"_id\": \"58eb78b94b432a21008c2346\",\n        \"name\": \"test author\",\n        \"username\": \"test author\",\n        \"avatar\": \"http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3.jpeg\",\n        \"email\": \"testauthor@istoryapp.com\"\n      },\n      \"story\": {\n        \"_id\": \"593f94bd17d85a0e003d3c34\",\n        \"title\": \"Story #1\",\n        \"created\": \"Tue Jun 13 2017 09:31:09 GMT+0200 (Central European Summer Time)\"\n      },\n      \"created\": \"Tue Feb 19 2019 14:28:39 GMT+0100 (Central European Standard Time)\",\n      \"_id\": \"5c6c0487e4ded13093911dfd\"\n    }],\n    \"total\": 4,\n    \"limit\": 1,\n    \"page\": 1,\n    \"pages\": 4\n  }\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/activities/social",
    "title": "Check new social activities",
    "version": "1.2.0",
    "name": "CheckNewSocial",
    "group": "Activities",
    "description": "<p>Check for new social activities</p>",
    "filename": "src/routes/activity/index.js",
    "groupTitle": "Activities",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n        \"author\": {\n          \"_id\": \"5a538361ea64260e00eb7547\",\n          \"name\": \"Family Member 1\",\n          \"username\": \"family1\",\n          \"avatar\": null,\n          \"email\": \"family1@istory.com\"\n        },\n        \"story\": {\n          \"_id\": \"5c75541d4eae16236d413ae3\",\n          \"title\": \"new story title\",\n          \"created\": \"Tue Feb 26 2019 15:58:37 GMT+0100 (Central European Standard Time)\"\n        },\n        \"message\": null,\n        \"type\": \"story_created\",\n        \"created\": \"Tue Feb 26 2019 15:58:37 GMT+0100 (Central European Standard Time)\"\n      },\n      {\n        \"author\": null,\n        \"story\": null,\n        \"message\": \"test message\",\n        \"type\": \"system_message\",\n        \"created\": \"Wed Jul 11 2018 11:26:09 GMT+0200 (Central European Summer Time)\"\n      }\n    ],\n    \"total\": 3,\n    \"limit\": 2,\n    \"page\": 1,\n    \"pages\": 2\n  }\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/activities/timeline",
    "title": "Check new timeline activities",
    "version": "1.2.0",
    "name": "CheckNewTimeline",
    "group": "Activities",
    "description": "<p>Check for new timeline activities</p>",
    "filename": "src/routes/activity/index.js",
    "groupTitle": "Activities",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          },
          {
            "group": "Query params",
            "type": "String[]",
            "allowedValues": [
              "\"audios\"",
              "\"videos\"",
              "\"images\""
            ],
            "optional": true,
            "field": "filter",
            "defaultValue": "[\"audios\",\"videos\",\"images\"",
            "description": "<p>filter content based on type</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2346\",\n        \"name\": \"sasha\",\n        \"username\": \"sasha\",\n        \"avatar\": \"http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n        \"email\": \"sasateodorovic57@istoryapp.com\"\n      },\n      \"story\": {\n        \"_id\": \"5939503417d85a0e003d3c23\",\n        \"title\": \"Shared Collaboration Story #1\",\n        \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\"\n      },\n      \"contents\": [{\n        \"height\": 1080,\n        \"width\": 1920,\n        \"duration\": {\n          \"seconds\": 10,\n          \"raw\": \"00:00:10.17\"\n        },\n        \"size\": 7751272,\n        \"video\": null,\n        \"videoId\": null,\n        \"place\": {\n          \"addr\": \"sample street 67–79, 11111, Neverland\",\n          \"name\": \"sample street 67–79\",\n          \"lon\": \"19.79655638891873\",\n          \"lat\": \"45.25497524173112\"\n        },\n        \"date\": \"2018-10-03T09:36:16.649Z\",\n        \"matchId\": \"t17C47200-2227-400D-9242-72BAC67CF17527\",\n        \"updated\": \"2018-07-11 16:26:09+0200\",\n        \"created\": \"2018-07-11 16:26:09+0200\",\n        \"caption\": \"idemooo\",\n        \"contentId\": \"424ef710-c7a6-11e8-b4c5-2971eb1d35e1\",\n        \"rtmp\": \"rtmp://s22evx7jej0vhx.cloudfront.net/5ba9d942c61d3c0f00ec0e44/42823c10-c7a6-11e8-b4c5-2971eb1d35e1.mov\",\n        \"image\": \"http://images/5ba9d942c61d3c0f00ec0e44/42be0c90-c7a6-11e8-b4c5-2971eb1d35e1.jpg\",\n        \"url\": \"http://videos/a9d942c61d3c0f00ec0e44/42823c10-c7a6-11e8-b4c5-2971eb1d35e1.mov\",\n        \"type\": \"video\"\n      }],\n      \"type\": \"new_content\"\n    }],\n    \"total\": 4,\n    \"limit\": 1,\n    \"page\": 4,\n    \"pages\": 4\n  }\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authors/:id/activities",
    "title": "Save activities check",
    "name": "SaveActivitiesCheck",
    "group": "Activities",
    "description": "<p>Save last time activities are checked by user</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "timeline",
            "description": "<p>new activity Date for timeline</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "social",
            "description": "<p>new activity Date for social</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaboration",
            "description": "<p>new activity Date for collaboration</p>"
          }
        ],
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Author ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  status: true,\n  message: \"You successfully update activites\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/activity/index.js",
    "groupTitle": "Activities",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authors/:id",
    "title": "Profile data",
    "version": "1.0.0",
    "name": "AuthorProfile",
    "group": "Author",
    "description": "<p>Get user's profile data</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>author ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"_id\": \"5cb9c583ba41473057b6c60b\",\n    \"name\": \"123\",\n    \"username\": \"test123\",\n    \"avatar\": \"\",\n    \"email\": \"test@test.com\",\n    \"bio\": \"\",\n    \"storage\": {\n      \"usage\": 0\n    },\n    \"stories\": {\n      \"total\": 2\n    },\n    \"following\": {\n       \"total\": 0\n    },\n    \"followers\": {\n       \"total\": 0\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authors/search",
    "title": "Author's search",
    "version": "1.2.0",
    "name": "AuthorSearch",
    "group": "Author",
    "description": "<p>Search authors by name, username and email</p>",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": false,
            "field": "search",
            "description": "<p>Search for authors name, username and email</p>"
          },
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [\n      {\n        \"_id\": \"5a538361ea64260e00eb7547\",\n        \"name\": \"Group Member 1\",\n        \"username\": \"group1\",\n        \"avatar\": null,\n        \"email\": \"group1@istoryapp.com\",\n        \"isFollowed\": false\n      },\n      {\n        \"_id\": \"5a538361ea64260e00eb7548\",\n        \"name\": \"Group Member 2\",\n        \"username\": \"group2\",\n        \"avatar\": null,\n        \"email\": \"group2@istoryapp.com\",\n        \"isFollowed\": true\n      },\n    ],\n    \"total\": 2,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authors/:id/stories",
    "title": "Author's stories",
    "version": "1.2.0",
    "name": "AuthorStories",
    "group": "Author",
    "description": "<p>Get profile data by author ID. By default show unlocked Stories by author (created and collaborator). If user trying to get own profile then show all Stories by user.</p>",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "allowedValues": [
              "author",
              "collaborator"
            ],
            "optional": true,
            "field": "filter",
            "defaultValue": "author",
            "description": "<p>Filter response based on author role</p>"
          },
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ],
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>author ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"_id\": \"5939503417d85a0e403d3c26\",\n      \"title\": \"Lorem ipsum dolor 1\",\n      \"slug\": \"lorem-ipsum-dolor-1\",\n      \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2346\",\n        \"name\": \"test name\",\n        \"username\": \"test username\",\n        \"avatar\": \"http://rekordr.s3.amazonaws.com/profile//165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n        \"email\": \"testauthor@istoryapp.com\"\n      },\n      \"pages\": [{\n        \"_id\": \"5939503417d85a0e003d3c2f\",\n        \"title\": \"collaborationtest page 4\",\n        \"slug\": \"page\",\n        \"matchId\": \"17a35844-426d-4160-b2a9-de765de23525\",\n        \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"content\": [{\n          \"matchId\": \"t8E2CD216-6EC4-4C0A-B670-09527D13A22F104\",\n          \"contentId\": \"2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf\",\n          \"style\": \"normal\",\n          \"type\": \"text\",\n          \"text\": \"<p ><font face=\\\"Avenir-Book\\\" style=\\\"font-size:18px;\\\">This is the text...</font></p>\",\n          \"created\": \"1497642155559\",\n          \"updated\": \"1497642155559\"\n        }],\n        \"theme\": {\n          \"cover\": \"\"\n        },\n        \"place\": {\n          \"lat\": null,\n          \"lon\": null,\n          \"name\": null\n        },\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }],\n      \"share\": {\n        \"followers\": \"true\",\n        \"link\": \"true\",\n        \"search\": \"true\"\n      },\n      \"collaborators\": [{\n        \"edit\": \"false\",\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }]\n    }],\n    \"total\": 1,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/storage",
    "title": "Author's storage",
    "version": "1.0.0",
    "name": "AuthorsStorage",
    "group": "Author",
    "description": "<p>Get storage usage for author and family group members.</p>",
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"author\": {\n      \"total\": {\n        \"bytes\": 512000,\n        \"format\": \"500 KB\"\n      },\n      \"used\": {\n        \"bytes\": 10240,\n        \"format\": \"10 KB\"\n      },\n      \"left\": {\n        \"bytes\": 501760,\n        \"format\": \"490 KB\"\n      }\n    },\n    \"members\": {\n      \"you\": {\n        \"bytes\": 10240,\n        \"format\": \"10 KB\"\n      },\n      \"others\": {\n        \"bytes\": 5791180,\n        \"format\": \"5.52 MB\"\n      },\n      \"left\": {\n        \"bytes\": 100080180,\n        \"format\": \"95.44 MB\"\n      },\n      \"total\": {\n        \"bytes\": 105881600,\n        \"format\": \"100.98 MB\"\n      }\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authors/:id/followers",
    "title": "Get a list of the followers",
    "version": "1.2.0",
    "name": "Followers",
    "group": "Author",
    "description": "<p>Get a list of the followers for author by ID</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>author ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n      \"followers\": {\n          \"docs\": [{\n              \"_id\": \"58eb78b94b432a21008c2347\",\n              \"name\": \"Test Author1\",\n              \"username\": \"testauthor1\",\n              \"avatar\": \"\",\n              \"email\": \"testauthor1@istoryapp.com\"\n          }],\n          \"total\": 1,\n          \"limit\": 10,\n          \"page\": 1,\n          \"pages\": 1\n      }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authors/:id/followings",
    "title": "Get a list of the followings",
    "version": "1.2.0",
    "name": "Followings",
    "group": "Author",
    "description": "<p>Get a list of the followings for author by ID</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>author ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n      \"following\": {\n          \"docs\": [{\n              \"_id\": \"58eb78b94b432a21008c2347\",\n              \"name\": \"Test Author1\",\n              \"username\": \"testauthor1\",\n              \"avatar\": \"\",\n              \"email\": \"testauthor1@istoryapp.com\"\n          }],\n          \"total\": 1,\n          \"limit\": 10,\n          \"page\": 1,\n          \"pages\": 1\n      }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authors/me",
    "title": "Get my profile",
    "version": "1.2.0",
    "name": "Profile",
    "group": "Author",
    "description": "<p>Get current author by token</p>",
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"_id\": \"5a538361ea64260e00eb7546\",\n    \"name\": \"test name\",\n    \"username\": \"test username\",\n    \"avatar\": null,\n    \"email\": \"testauthor@istoryapp.com\",\n    \"bio\": \"My story...\",\n    \"stories\": {\n      \"total\": 0\n    },\n    \"following\": {\n      \"total\": 0\n    },\n    \"followers\": {\n        \"total\": 0\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/authors/username/:username",
    "title": "Get a profile by username",
    "version": "1.2.0",
    "name": "Profile",
    "group": "Author",
    "description": "<p>Get a list of the followings for author by ID</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>author's username</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"_id\": \"5a538361ea64260e00eb7546\",\n    \"name\": \"test name\",\n    \"username\": \"test username\",\n    \"avatar\": null,\n    \"email\": \"testauthor@istoryapp.com\",\n    \"bio\": \"My story...\",\n    \"stories\": {\n      \"total\": 0\n    },\n    \"following\": {\n      \"total\": 0\n    },\n    \"followers\": {\n        \"total\": 0\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/search",
    "title": "Search for stories and authors",
    "version": "1.0.0",
    "name": "Search",
    "group": "Author",
    "description": "<p>Search Stories (only unlocked Stories or Stories user have access for) and Authors (by username, name and email)</p>",
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"stories\": {\n      \"docs\": [{\n          \"_id\": \"5b2fb7e2d216c70e00c357f7\",\n          \"title\": \"test story 1\",\n          \"created\": \"Sun Jun 24 2018 17:25:22 GMT+0200 (Central European Summer Time)\",\n          \"slug\": \"dsadwq\",\n          \"created\": \"Wed May 08 2019 09:50:01 GMT+0200 (CEST)\",\n          \"updated\": \"Wed May 08 2019 12:02:14 GMT+0200 (CEST)\",\n          \"author\": {\n              \"_id\": \"5c9bce90e456bc4729c31d8b\",\n              \"name\": \"nikson1\",\n              \"username\": \"nikson\",\n              \"avatar\": \"The_Earth_seen_from_Apollo_17.jpg\",\n              \"email\": \"mnikson@gmail.com\",\n              \"isFollowed\": false\n          },\n          \"pages\": [],\n          \"share\": {\n              \"followers\": \"false\",\n              \"link\": \"false\",\n              \"search\": \"false\"\n          },\n          \"collaborators\": [],\n          \"isFavorite\": null,\n          \"commentsCount\": 0,\n          \"shareLink\": \"https://istoryapp.com/undefined/story/dsadwq\",\n          \"edit\": true,\n          \"pagesNumber\": 0\n      },\n      {\n          \"_id\": \"5939503417d85a0e003d3c23\",\n          \"title\": \"test story 2\",\n          \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n          \"slug\": \"dsadwq\",\n          \"created\": \"Wed May 08 2019 09:50:01 GMT+0200 (CEST)\",\n          \"updated\": \"Wed May 08 2019 12:02:14 GMT+0200 (CEST)\",\n          \"author\": {\n              \"_id\": \"5c9bce90e456bc4729c31d8b\",\n              \"name\": \"nikson1\",\n              \"username\": \"nikson\",\n              \"avatar\": \"The_Earth_seen_from_Apollo_17.jpg\",\n              \"email\": \"mnikson@gmail.com\",\n              \"isFollowed\": false\n          },\n          \"pages\": [],\n          \"share\": {\n              \"followers\": \"false\",\n              \"link\": \"false\",\n              \"search\": \"false\"\n          },\n          \"collaborators\": [],\n          \"isFavorite\": null,\n          \"commentsCount\": 0,\n          \"shareLink\": \"https://istoryapp.com/undefined/story/dsadwq\",\n          \"edit\": true,\n          \"pagesNumber\": 0\n        }\n      ],\n      \"total\": 2,\n      \"limit\": 2,\n      \"page\": 1,\n      \"pages\": 1\n    },\n    \"authors\": {\n      \"docs\": [{\n          \"_id\": \"5a538361ea64260e00eb7546\",\n          \"name\": \"Test author 5\",\n          \"username\": \"tester\",\n          \"avatar\": null,\n          \"email\": \"testauthor5@istory.com\"\n        },\n        {\n          \"_id\": \"58eb78b94b432a21008c2348\",\n          \"name\": \"Test Author2\",\n          \"username\": \"testauthor2\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor2@istory.com\"\n        }\n      ],\n      \"total\": 2,\n      \"limit\": 2,\n      \"page\": 1,\n      \"pages\": 1\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": false,
            "field": "search",
            "description": "<p>Search Stories (only unlocked Stories or Stories user have access for) and Authors (by username, name and email)</p>"
          },
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "authorSort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "authorLimit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "authorPage",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          },
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "storySort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "storyLimit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "storyPage",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/change-password",
    "title": "Change password",
    "version": "1.0.0",
    "name": "changePassword",
    "group": "Author",
    "description": "<p>User can change his password by entering old password and new password with password confirmation</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>User's old password</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>User's new password</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "newPasswordConfirmation",
            "description": "<p>User's confirmation of new password</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"message\": \"Password is changed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/authors/:id",
    "title": "Delete account",
    "version": "1.2.0",
    "name": "deleteAccount",
    "group": "Author",
    "description": "<p>Delete authors's account</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>author ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully deleted account\",\n  \"data\": {\n    \"_id\": \"5a538361ea64260e00eb7546\",\n    \"name\": \"test author\",\n    \"username\": \"test author\",\n    \"avatar\": null,\n    \"email\": \"testauthor@istoryapp.com\",\n    \"bio\": \"\",\n    \"active\": false,\n    \"deleted\": true,\n    \"deletedAt\": \"2019-04-19T13:57:55.721Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/forgot-password",
    "title": "Forgot password",
    "version": "1.0.0",
    "name": "forgotPassword",
    "group": "Author",
    "description": "<p>Forgot password for user. User must provide email, if exist in database email with link for password reset will be sent on entered email</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"message\": \"Email link send on email ...\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login user",
    "version": "1.0.0",
    "name": "login",
    "group": "Author",
    "description": "<p>User must provide email and password</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's password</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"_id\": \"58eb78b94b432a21008c2346\",\n    \"name\": \"test user\",\n    \"username\": \"test user\",\n    \"avatar\": \"http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n    \"bio\": \"bio\",\n    \"location\": {\n      \"name\": \"Novi Sad\",\n      \"lon\": \"19.8369444\",\n      \"lat\": \"45.2516667\"\n    },\n    \"token\": {\n      \"access\": \"8ug7V79qH4U8soZ7oJ6qhRqaNHFJA2Wt\",\n      \"refresh\": \"NAH0HUftmmvc3KL7pJUTWwVFiNlxFlHw\",\n      \"expired\": \"2022-06-07T08:55:25.000Z\"\n    },\n    \"email\": \"testuser@istoryapp.com\",\n    \"plan\": {\n      \"level\": \"BASIC\"\n    },\n    \"storage\": {\n      \"usage\": 10240\n    },\n    \"notif\": {\n      \"collaboration\": {\n        \"userLeavesStory\": true,\n        \"removedFromStory\": true,\n        \"storyUpdates\": true,\n        \"newCollaborator\": true,\n        \"invitations\": true\n      },\n      \"social\": {\n        \"newFollower\": true,\n        \"comments\": true,\n        \"favoritedYourStory\": true,\n        \"sharedStory\": true,\n        \"friendStoryUpdates\": true,\n        \"friendNewStory\": true,\n        \"newFriend\": true\n      }\n    },\n    \"pushNotif\": {\n      \"newStoryShare\": true,\n      \"newStoryPublic\": true,\n      \"newFollower\": true,\n      \"newComment\": true\n    },\n    \"sync\": {\n      \"lastCheck\": null\n    },\n    \"firstTime\": true\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/refresh-token",
    "title": "Refresh token",
    "version": "1.0.0",
    "name": "refreshToken",
    "group": "Author",
    "description": "<p>Refresh authorization token when it's expired</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>User's refresh token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"token\": {\n    \"access\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\",\n      \"expired\": \"2019-05-19T13:54:05.007Z\",\n      \"refresh\": \"dGunTlGJlfQ1RRAQ6sUaox6jmHFDEFeYxtg8ldRGvESmmMWdI727sWz1DFDJ9ET7\"\n    },\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/register",
    "title": "Register new user",
    "version": "1.0.0",
    "name": "register",
    "group": "Author",
    "description": "<p>User must provide username and email address, password, password confirmation</p>",
    "parameter": {
      "fields": {
        "Body prams": [
          {
            "group": "Body prams",
            "type": "String",
            "optional": true,
            "field": "invitationToken",
            "description": "<p>Token for confirming group invitation</p>"
          },
          {
            "group": "Body prams",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": ""
          },
          {
            "group": "Body prams",
            "type": "String",
            "optional": false,
            "field": "user.username",
            "description": "<p>User's username</p>"
          },
          {
            "group": "Body prams",
            "type": "String",
            "optional": true,
            "field": "user.name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Body prams",
            "type": "String",
            "optional": false,
            "field": "user.email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Body prams",
            "type": "String",
            "optional": false,
            "field": "user.password",
            "description": "<p>User's password</p>"
          },
          {
            "group": "Body prams",
            "type": "String",
            "optional": false,
            "field": "user.passwordConfirmation",
            "description": "<p>User's password confirmation</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"_id\": \"5cb9c583ba41473057b6c60b\",\n    \"name\": \"123\",\n    \"username\": \"test123\",\n    \"avatar\": \"\",\n    \"token\": {\n      \"access\": \"V8sud9mUn6jhDCaPKpCJR064lIuxm_3Fcf6_xbVrgQ4\",\n      \"refresh\": \"V51diIX3xZ0n3tSfSLBc9WE95wO3obwpgySddeAqD1f0RciF0Z6sXvRkQq0fxbxw\"\n    },\n    \"email\": \"test@test.com\",\n    \"bio\": \"\",\n    \"plan\": {\n      \"level\": \"BASIC\",\n      \"expires\": null\n    },\n    \"storage\": {\n      \"usage\": 0\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/new-password",
    "title": "Reset password",
    "version": "1.0.0",
    "name": "resetPassword",
    "group": "Author",
    "description": "<p>Reset password from forgot password email</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Code from the email</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>New password</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "retypedPassword",
            "description": "<p>Repeated new password</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"message\": \"You successfully reset password\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authors/notifications",
    "title": "Save settings for notifications",
    "version": "1.0.0",
    "name": "saveSettingsNotifications",
    "group": "Author",
    "description": "<p>Save settings for notifications by user</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "collaboration",
            "description": ""
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaboration.userLeavesStory",
            "description": "<p>User leaves story</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaboration.removedFromStory",
            "description": "<p>User removed from story</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaboration.storyUpdates",
            "description": "<p>Story updates</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaboration.newCollaborator",
            "description": "<p>New collaborator</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaboration.invitations",
            "description": "<p>Invitations</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "social",
            "description": ""
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "social.newFollower",
            "description": "<p>New follower</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "social.comments",
            "description": "<p>Comments</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "social.favoritedYourStory",
            "description": "<p>Favorited your story</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "social.sharedStory",
            "description": "<p>Shared story</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "social.friendStoryUpdates",
            "description": "<p>Friend story updates</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "social.friendNewStory",
            "description": "<p>Friend new story</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "social.newFriend",
            "description": "<p>New friend</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully saved settings for notifications\",\n  \"data\": {\n    \"_id\": \"58eb78b94b432a21008c2346\",\n    \"name\": \"test name\",\n    \"username\": \"test username\",\n    \"avatar\": \"http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n    \"token\": {\n      \"access\": \"8ug7V79qH4U8soZ7oJ6qhRqaNHFJA2Wt\"\n    },\n    \"email\": \"testuser@istoryapp.com\",\n    \"bio\": \"Test bio\",\n    \"notif\": {\n      \"collaboration\": {\n        \"userLeavesStory\": true,\n        \"removedFromStory\": false,\n        \"storyUpdates\": false,\n        \"newCollaborator\": true,\n        \"invitations\": false\n      },\n      \"social\": {\n        \"newFollower\": false,\n        \"comments\": true,\n        \"favoritedYourStory\": false,\n        \"sharedStory\": false,\n        \"friendStoryUpdates\": true,\n        \"friendNewStory\": false,\n        \"newFriend\": false\n      }\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authors/push-notifications",
    "title": "Save settings push notifications",
    "version": "1.0.0",
    "name": "saveSettingsPushNotifications",
    "group": "Author",
    "description": "<p>Save settings for push notifications by user</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "newStoryShare",
            "description": "<p>New story share</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "newStoryPublic",
            "description": "<p>New story public</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "newFollower",
            "description": "<p>New follower</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "newComment",
            "description": "<p>New comment</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully saved settings for push notifications\",\n  \"data\": {\n    \"_id\": \"58eb78b94b432a21008c2346\",\n    \"name\": \"test name\",\n    \"username\": \"test username\",\n    \"avatar\": \"http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n    \"token\": {\n      \"access\": \"8ug7V79qH4U8soZ7oJ6qhRqaNHFJA2Wt\"\n    },\n    \"email\": \"testuser@istoryapp.com\",\n    \"bio\": \"test bio\",\n    \"pushNotif\": {\n      \"newStoryShare\": true,\n      \"newStoryPublic\": false,\n      \"newFollower\": false,\n      \"newComment\": true\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authors",
    "title": "Update profile",
    "version": "1.0.0",
    "name": "updateProfile",
    "group": "Author",
    "description": "<p>Update profile by user (name, username, settings)</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User's username</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "bio",
            "description": "<p>User's bio</p>"
          },
          {
            "group": "Body params",
            "type": "Binary",
            "optional": false,
            "field": "avatar",
            "description": "<p>User's avatar</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>Location</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "location.name",
            "description": "<p>Location name</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "location.lat",
            "description": "<p>Location latitude</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "location.lon",
            "description": "<p>Location longitude</p>"
          }
        ]
      }
    },
    "filename": "src/routes/author/index.js",
    "groupTitle": "Author",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"_id\": \"5cb9c583ba41473057b6c60b\",\n    \"name\": \"123\",\n    \"username\": \"test123\",\n    \"avatar\": \"\",\n    \"token\": {\n      \"access\": \"V8sud9mUn6jhDCaPKpCJR064lIuxm_3Fcf6_xbVrgQ4\",\n      \"refresh\": \"V51diIX3xZ0n3tSfSLBc9WE95wO3obwpgySddeAqD1f0RciF0Z6sXvRkQq0fxbxw\"\n    },\n    \"email\": \"test@test.com\",\n    \"bio\": \"\",\n    \"plan\": {\n      \"level\": \"BASIC\",\n      \"expires\": null\n    },\n    \"storage\": {\n      \"usage\": 0\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "patch",
    "url": "/collaboration/cancel",
    "title": "Cancel invitation",
    "version": "1.0.0",
    "name": "collaborationCancel",
    "group": "Collaboration",
    "description": "<p>Cancel invitation for a collaboration by emails</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "storyId",
            "description": "<p>Story ID for collaboration</p>"
          },
          {
            "group": "Body params",
            "type": "Array",
            "optional": false,
            "field": "emails",
            "description": "<p>List of an emails to invitation cancel for</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"message\": \"The 2 invitation(s) has been cancelled successfully\",\n   \"status\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/collaboration/index.js",
    "groupTitle": "Collaboration",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Forbidden",
          "content": "HTTP/1.1 403 Forbidden\n{\n   name: \"Forbidden\",\n   message: \"sample Forbidden message\",\n   statusCode: 403,\n   errorCode: 403\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/collaboration/:id",
    "title": "Invite collaborator",
    "version": "1.0.0",
    "name": "collaborationInvite",
    "group": "Collaboration",
    "description": "<p>Invite author who is following user to join Story</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Story ID (ObjectID type)</p>"
          }
        ],
        "Body params": [
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "collaborators",
            "description": ""
          },
          {
            "group": "Body params",
            "type": "Object[]",
            "optional": false,
            "field": "collaborators.userIds",
            "description": "<p>List of user ids and edit privileges</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaborators.userIds.id",
            "description": "<p>ID of potential collaborator (ObjectID type)</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaborators.userIds.edit",
            "description": "<p>Edit privileges for potential collaborator</p>"
          },
          {
            "group": "Body params",
            "type": "Object[]",
            "optional": false,
            "field": "collaborators.emailAddresses",
            "description": "<p>List of user emails and edit privileges</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaborators.emailAddresses.email",
            "description": "<p>Email of potential collaborator (ObjectID type)</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaborators.emailAddresses.edit",
            "description": "<p>Edit privileges for potential collaborator</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {[\n     \"_id\": \"123456\",\n     \"name\": \"sample name\",\n     \"avatar\": \"sample avatar\",\n     \"username\": \"sample username\",\n     \"email\": \"sample email\"\n  ]}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/collaboration/index.js",
    "groupTitle": "Collaboration",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/collaboration/:id",
    "title": "Leave invitation",
    "version": "1.0.0",
    "name": "collaborationLeave",
    "group": "Collaboration",
    "description": "<p>User leaves collaboration</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Story ID for collaboration</p>"
          }
        ],
        "Body params": [
          {
            "group": "Body params",
            "type": "Boolean",
            "optional": false,
            "field": "deletePages",
            "description": "<p>delete pages from story</p>"
          }
        ]
      }
    },
    "filename": "src/routes/collaboration/index.js",
    "groupTitle": "Collaboration",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully leaved story\",\n  \"data\": {\n    \"theme\": {\n      \"cover\": null\n    },\n    \"share\": {\n      \"followers\": false,\n      \"link\": false,\n      \"search\": false\n    },\n    \"pages\": [\n      \"5cbdc76d0cda18158e4bf350\"\n    ],\n    \"views\": 0,\n    \"active\": true,\n    \"_id\": \"5cbdc76d0cda18158e4bf34f\",\n    \"title\": \"corporis quaerat - your pages\",\n    \"status\": \"private\",\n    \"collaborators\": [],\n    \"created\": \"2019-04-22T13:53:49.399Z\",\n    \"updated\": \"2019-04-22T13:53:49.418Z\",\n    \"deleted\": false,\n    \"banInPublic\": false,\n    \"featured\": false,\n    \"author\": \"5cbdc76d0cda18158e4bf331\",\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/collaboration/:id/remove",
    "title": "Remove from collaboration",
    "version": "1.0.0",
    "name": "collaborationRemoce",
    "group": "Collaboration",
    "description": "<p>Remove author from collaboration. In that case copy author's pages in new Story {story's title}-copy</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Story ID for collaboration</p>"
          },
          {
            "group": "Body params",
            "type": "Array",
            "optional": false,
            "field": "userId",
            "description": "<p>User ID od array of IDs</p>"
          }
        ]
      }
    },
    "filename": "src/routes/collaboration/index.js",
    "groupTitle": "Collaboration",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Users are removed from collaboration\",\n  \"data\": [{\n    \"theme\": {\n      \"cover\": null\n    },\n    \"share\": {\n      \"followers\": false,\n      \"link\": false,\n      \"search\": false\n    },\n    \"pages\": [\n      \"5cbdc93d0cda18158e4bf877\"\n    ],\n    \"views\": 0,\n    \"active\": true,\n    \"_id\": \"5cbdc93d0cda18158e4bf876\",\n    \"title\": \"eum eum - your pages\",\n    \"status\": \"private\",\n    \"collaborators\": [],\n    \"created\": \"2019-04-22T14:01:33.665Z\",\n    \"updated\": \"2019-04-22T14:01:33.683Z\",\n    \"deleted\": false,\n    \"banInPublic\": false,\n    \"featured\": false,\n    \"author\": \"5cbdc93d0cda18158e4bf864\",\n    \"__v\": 0\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "patch",
    "url": "/collaboration/:id",
    "title": "Update collaborator",
    "version": "1.0.0",
    "name": "collaborationUpdate",
    "group": "Collaboration",
    "description": "<p>Update collaboration</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Story ID for collaboration</p>"
          }
        ],
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Author ID to whom whats to change story permission</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You have successfully updated collaborator\",\n  \"data\": {\n    \"edit\": true,\n    \"author\": {\n       \"_id\": \"5cbdca350cda18158e4bfc99\",\n       \"name\": \"sample name\",\n       \"avatar\": \"sample avatar\",\n       \"username\": \"sample username\",\n       \"email\": \"sample email\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/collaboration/index.js",
    "groupTitle": "Collaboration",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Forbidden",
          "content": "HTTP/1.1 403 Forbidden\n{\n   name: \"Forbidden\",\n   message: \"sample Forbidden message\",\n   statusCode: 403,\n   errorCode: 403\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/pages/:id/comments",
    "title": "Comments by pageId",
    "version": "1.0.0",
    "name": "CommentsById",
    "group": "Comment",
    "description": "<p>Get all comments on page</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Page ID</p>"
          }
        ],
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "filename": "src/routes/comment/index.js",
    "groupTitle": "Comment",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"_id\": \"58eb78b94b432a21008c2348\",\n      \"page\": \"593f94bd17d85a0e003d3c36\",\n      \"text\": \"komentar 2\",\n      \"created\": \"Fri Apr 20 2018 08:11:27 GMT+0200 (Central European Summer Time)\",\n      \"spam\": 0,\n      \"reply\": {},\n      \"author\": {\n        \"_id\": \"5a538361ea64260e00eb7546\",\n        \"name\": \"testAuthor\",\n        \"username\": \"testAuthor\",\n        \"avatar\": null,\n        \"email\": \"testauthor@istory.com\"\n      }\n    }],\n    \"total\": 5,\n    \"limit\": 1,\n    \"page\": 2,\n    \"pages\": 5\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/comments/:id",
    "title": "Edit comment",
    "version": "1.0.0",
    "name": "Edit_comment",
    "group": "Comment",
    "description": "<p>Edit comment on page by ID. Only author can edit a comment</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Comment ID</p>"
          }
        ],
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Comment text</p>"
          }
        ]
      }
    },
    "filename": "src/routes/comment/index.js",
    "groupTitle": "Comment",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"active\": true,\n    \"deleted\": false,\n    \"_id\": \"5cbdd41fe5c56318868e12e7\",\n    \"author\": {\n      \"name\": \"test name\",\n      \"avatar\": \"http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"username\": \"test username\",\n      \"email\": \"testauthor@istoryapp.com\"\n    },\n    \"page\": \"593f94bd17d85a0e003d3c36\",\n    \"text\": \"hej\",\n    \"created\": \"2019-04-22T14:47:59.646Z\",\n    \"spam\": 0,\n    \"reply\": {\n      \"_id\": \"5b29f711d216c70e00c357b7\",\n      \"author\": {\n        \"name\": \"nikson1\",\n         \"avatar\": \"The_Earth_seen_from_Apollo_17.jpg\",\n         \"_id\": \"5c9bce90e456bc4729c31d8b\",\n         \"email\": \"mnikson@gmail.com\",\n         \"username\": \"nikson\",\n         \"id\": \"5c9bce90e456bc4729c31d8b\"\n       },\n       \"page\": \"5cd2a809c3a46b0c34d0cf15\",\n       \"text\": \"Comment\"\n    },\n    \"updated\": \"2019-04-22T14:47:59.646Z\",\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Forbidden",
          "content": "HTTP/1.1 403 Forbidden\n{\n   name: \"Forbidden\",\n   message: \"sample Forbidden message\",\n   statusCode: 403,\n   errorCode: 403\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/comments/:id/replies",
    "title": "Replies by commentId",
    "version": "1.0.0",
    "name": "RepliesById",
    "group": "Comment",
    "description": "<p>Get all replies for comment</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>comment ID</p>"
          }
        ],
        "Query params": [
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "filename": "src/routes/comment/index.js",
    "groupTitle": "Comment",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"_id\": \"58eb78b94b432a21008c2348\",\n      \"page\": \"593f94bd17d85a0e003d3c36\",\n      \"text\": \"komentar 2\",\n      \"created\": \"Fri Apr 20 2018 08:11:27 GMT+0200 (Central European Summer Time)\",\n      \"spam\": 0,\n      \"reply\": {},\n      \"author\": {\n        \"_id\": \"5a538361ea64260e00eb7546\",\n        \"name\": \"testAuthor\",\n        \"username\": \"testAuthor\",\n        \"avatar\": null,\n        \"email\": \"testauthor@istory.com\"\n      }\n    }],\n    \"total\": 5,\n    \"limit\": 1,\n    \"page\": 2,\n    \"pages\": 5\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/comments",
    "title": "Page comment",
    "version": "1.0.0",
    "name": "comment",
    "group": "Comment",
    "description": "<p>Post comment on page</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "pageId",
            "description": "<p>Page ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Comment text</p>"
          }
        ]
      }
    },
    "filename": "src/routes/comment/index.js",
    "groupTitle": "Comment",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"active\": true,\n    \"deleted\": false,\n    \"_id\": \"5cbdd41fe5c56318868e12e7\",\n    \"author\": {\n      \"name\": \"test name\",\n      \"avatar\": \"http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"username\": \"test username\",\n      \"email\": \"testauthor@istoryapp.com\"\n    },\n    \"page\": \"593f94bd17d85a0e003d3c36\",\n    \"text\": \"hej\",\n    \"created\": \"2019-04-22T14:47:59.646Z\",\n    \"spam\": 0,\n    \"reply\": null,\n    \"updated\": \"2019-04-22T14:47:59.646Z\",\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/comments/:id",
    "title": "Delete a comment",
    "version": "1.0.0",
    "name": "comment_delete",
    "group": "Comment",
    "description": "<p>Delete a comment by ID</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>comment ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"data\": {\n     \"id\": \"5cbdd052e5c56318868e0713\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/comment/index.js",
    "groupTitle": "Comment",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/comments/:id/reply",
    "title": "Page comment reply",
    "version": "1.0.0",
    "name": "comment_reply",
    "group": "Comment",
    "description": "<p>Post reply on comment</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>comment ID</p>"
          }
        ],
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Comment text</p>"
          }
        ]
      }
    },
    "filename": "src/routes/comment/index.js",
    "groupTitle": "Comment",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"active\": true,\n    \"deleted\": false,\n    \"_id\": \"5cbdd41fe5c56318868e12e7\",\n    \"author\": {\n      \"name\": \"test name\",\n      \"avatar\": \"http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"username\": \"test username\",\n      \"email\": \"testauthor@istoryapp.com\"\n    },\n    \"page\": \"593f94bd17d85a0e003d3c36\",\n    \"text\": \"hej\",\n    \"created\": \"2019-04-22T14:47:59.646Z\",\n    \"spam\": 0,\n    \"reply\": {\n      \"_id\": \"5b29f711d216c70e00c357b7\",\n      \"author\": {\n        \"name\": \"nikson1\",\n         \"avatar\": \"The_Earth_seen_from_Apollo_17.jpg\",\n         \"_id\": \"5c9bce90e456bc4729c31d8b\",\n         \"email\": \"mnikson@gmail.com\",\n         \"username\": \"nikson\",\n         \"id\": \"5c9bce90e456bc4729c31d8b\"\n       },\n       \"page\": \"5cd2a809c3a46b0c34d0cf15\",\n       \"text\": \"Comment\"\n    },\n    \"updated\": \"2019-04-22T14:47:59.646Z\",\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/devices",
    "title": "Register device",
    "name": "registerDevice",
    "version": "1.0.0",
    "group": "Devices",
    "description": "<p>Register device for user. One user may have more then one device.</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "appVersion",
            "description": ""
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "locale",
            "description": ""
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "osVersion",
            "description": ""
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "pushToken",
            "description": ""
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "timezone",
            "description": ""
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Device successfully added\",\n  \"data\": {\n    \"_id\": \"58eb78b94b432a21008c2348\",\n    \"platform\": \"ios\",\n    \"appVersion\": \"12\",\n    \"pushToken\": \"c643b5bcd844a829b424a08681d16d6b33afe48e4f1c5c86247b33ad6d55ec42\",\n    \"osVersion\": \"11.2.6\",\n    \"timezone\": \"America/New_York\",\n    \"locale\": \"en-US\",\n    \"author\": \"58eb78b94b432a21008c2347\",\n    \"created\": \"2019-04-22T16:06:01.606Z\",\n    \"updated\": \"2019-04-22T16:06:01.815Z\",\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/device/index.js",
    "groupTitle": "Devices",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authors/follow",
    "title": "Follow author",
    "name": "followAuthor",
    "version": "1.0.0",
    "group": "Following",
    "description": "<p>Follow author</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "authorId",
            "description": "<p>author ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully followed author\",\n  \"data\": {\n    \"_id\": \"58eb78b94b432a21008c2348\",\n    \"name\": \"Test Author2\",\n    \"username\": \"testauthor2\",\n    \"avatar\": \"\",\n    \"email\": \"testauthor2@istoryapp.com\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/follow/index.js",
    "groupTitle": "Following",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/authors/unfollow",
    "title": "Unfollow author",
    "name": "unfollowAuthor",
    "version": "1.0.0",
    "group": "Following",
    "description": "<p>Unfollow author</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "authorId",
            "description": "<p>author ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully followed author\",\n  \"data\": {\n    \"_id\": \"58eb78b94b432a21008c2348\",\n    \"name\": \"Test Author2\",\n    \"username\": \"testauthor2\",\n    \"avatar\": \"\",\n    \"email\": \"testauthor2@istoryapp.com\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/follow/index.js",
    "groupTitle": "Following",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/group/accept",
    "title": "Accept invitation for group",
    "version": "1.0.0",
    "name": "group_accept",
    "group": "Group",
    "description": "<p>User must provide token and response to accept or decline invitation for group</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "accept",
            "description": "<p>User's respone on invitation</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Invitation token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully send response on invitation\"\n  \"data\": {\n     \"accepted\": true,\n     \"group\": \"5349b4ddd2781d08c09890f4\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/group/index.js",
    "groupTitle": "Group",
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/group/cancel/:id",
    "title": "Cancel group invitation",
    "version": "1.0.0",
    "name": "group_cancel",
    "group": "Group",
    "description": "<p>User need to provide invitation id to cancel invitation. Only author of invitation can cancel invitation.</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>group invitation ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"message\": \"You successfully canceled group invitation\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/group/index.js",
    "groupTitle": "Group",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/group/invite",
    "title": "Invite user to group",
    "version": "1.0.0",
    "name": "group_invite",
    "group": "Group",
    "description": "<p>User must provide email address for another user whom want to invite</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully send invitation\",\n  \"data\": {\n    \"email\": \"group4@istoryapp.com\",\n    \"invited\": {\n      \"_id\": \"5a538361ea64260e00eb7550\",\n      \"name\": \"Group Member 4\",\n      \"username\": \"group4\",\n      \"avatar\": null,\n      \"email\": \"group4@istoryapp.com\"\n    },\n    \"token\": \"d3c5b5f625d911e7e416c6bf751db07e10f9ae4f87332bba6ffce860f9\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/group/index.js",
    "groupTitle": "Group",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/group/leave",
    "title": "Leave group",
    "version": "1.0.0",
    "name": "group_leave",
    "group": "Group",
    "description": "<p>User must provide ID to leave group</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully left the group\"\n  \"data\": {\n     \"group\": \"5349b4ddd2781d08c09890f3\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/group/index.js",
    "groupTitle": "Group",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/group/remove",
    "title": "Remove group",
    "version": "1.0.0",
    "name": "group_remove",
    "group": "Group",
    "description": "<p>User need to provide Id to remove someone from group and must be an owner of a group</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "groupUser",
            "description": "<p>User that's going to be removed</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "group",
            "description": "<p>ID of a targeted group</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"You successfully removed user from group\"\n  \"data\": {\n     \"group\": \"5349b4ddd2781d08c09890f3\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/group/index.js",
    "groupTitle": "Group",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/pages/copy",
    "title": "Copy page",
    "version": "1.0.0",
    "name": "copyPage",
    "group": "Page",
    "description": "<p>Copy page to another story</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "pageId",
            "description": "<p>Page ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "storyId",
            "description": "<p>Story ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/page/index.js",
    "groupTitle": "Page",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"content\": [\n      {\n        \"video\": null,\n        \"videoId\": null,\n        \"place\": {\n          \"addr\": \"Ulica Stojana, 21137 Central Serbia, Serbia\",\n          \"name\": \"Ulica Stojana\",\n          \"lng\": null,\n          \"lat\": \"45.25719798639906\"\n        },\n        \"date\": \"2017-06-09T07:32:17.000Z\",\n        \"matchId\": \"tF02B6DE5-C714-406D-9510-740AB08D1E959\",\n        \"updated\": \"1497339307649\",\n        \"created\": \"1497339307649\",\n        \"caption\": \"brm brm\",\n        \"contentId\": \"d0d38d91-6538-11e9-90f5-abd4496146e2\",\n        \"rtmp\": \"http://sample.s3.amazonaws.com/test/video.mp4\",\n        \"image\": \"http://sample.s3.amazonaws.com/test/image.jpg\",\n        \"url\": \"http://sample.s3.amazonaws.com/test/video.mp4\",\n        \"type\": \"video\",\n        \"size\": 120000\n      }\n    ],\n    \"deleted\": false,\n    \"_id\": \"5cbe1c96bc59553a9a1b8204\",\n    \"author\": {\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"name\": \"John Doe\",\n      \"username\": \"johndoe\",\n      \"avatar\": null,\n      \"email\": \"johndoe@istoryapp.com\"\n    },\n    \"active\": true,\n    \"status\": \"public\",\n    \"created\": \"2019-04-22T19:57:10.760Z\",\n    \"updated\": \"2019-04-22T19:57:10.760Z\",\n    \"title\": \"page Copy\",\n    \"slug\": \"page-copy\",\n    \"theme\": {\n      \"cover\": \"http://rekordr.s3.amazonaws.com/test/image.jpg\"\n    },\n    \"dateFrom\": \"2017-06-13T07:35:07.532Z\",\n    \"dateTo\": \"2017-06-13T07:35:07.532Z\",\n    \"original\": \"593f94bd17d85a0e003d3c36\",\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/pages",
    "title": "Create page",
    "version": "1.1.0",
    "name": "createPage",
    "group": "Page",
    "description": "<p>Create page by user</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "storyId",
            "description": "<p>Story ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>Page title</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "pageNumber",
            "description": "<p>Page number in order</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "matchId",
            "description": "<p>Match ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "cover",
            "description": "<p>Page cover</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "dateFrom",
            "description": "<p>Date from</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "dateTo",
            "description": "<p>Date to</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": true,
            "field": "place",
            "description": "<p>place</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "place.name",
            "description": "<p>Place name</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "place.lat",
            "description": "<p>Place latitude</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "place.lon",
            "description": "<p>place longitude</p>"
          },
          {
            "group": "Body params",
            "type": "Object[]",
            "optional": false,
            "field": "content",
            "description": "<p>Page content</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "content.type",
            "description": "<p>Page content type (text, audio, recording, image, gallery, gif, video)</p>"
          },
          {
            "group": "Body params",
            "type": "Binary",
            "optional": false,
            "field": "content.file",
            "description": "<p>Page content file</p>"
          }
        ]
      }
    },
    "filename": "src/routes/page/index.js",
    "groupTitle": "Page",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"content\": [{\n    \"updated\": \"2019-04-22T20:23:55.451Z\",\n    \"created\": \"2019-04-22T20:23:55.451Z\",\n    \"text\": \"this is the text element\",\n    \"type\": \"text\",\n    \"style\": \"normal\",\n    \"contentId\": \"8d4bd0b0-653c-11e9-b97c-454c9b7f9566\",\n    \"matchId\": \"1234\"\n  }],\n  \"deleted\": false,\n  \"_id\": \"5cbe22db28b92b3e7acde09c\",\n  \"author\": {\n    \"_id\": \"58eb78b94b432a21008c2346\",\n    \"name\": \"John Doe\",\n    \"username\": \"johndoe\",\n    \"avatar\": null,\n    \"email\": \"johndoe@istoryapp.com\"\n  },\n  \"title\": \"new page\",\n  \"slug\": \"new-page\",\n  \"status\": \"public\",\n  \"active\": true,\n  \"created\": \"2019-04-22T20:23:55.446Z\",\n  \"updated\": \"2019-04-22T20:23:55.458Z\",\n  \"__v\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/pages/:id/delete",
    "title": "Delete page",
    "version": "1.0.0",
    "name": "deletePage",
    "group": "Page",
    "description": "<p>Delete page</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Page ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "storyId",
            "description": "<p>Story ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"message\": \"You successfully deleted page\",\n  \"data\": \"5cbdd052e5c56318868e0713\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/page/index.js",
    "groupTitle": "Page",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/pages/:id/contents",
    "title": "Insert content",
    "version": "1.0.0",
    "name": "insertContent",
    "group": "Page",
    "description": "<p>Insert single content element in page</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Page ID</p>"
          }
        ],
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "storyId",
            "description": "<p>Story ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>Page order</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "content",
            "description": "<p>Page content</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "content.type",
            "description": "<p>Content type</p>"
          },
          {
            "group": "Body params",
            "type": "Binary",
            "optional": false,
            "field": "files",
            "description": "<p>Page files</p>"
          }
        ]
      }
    },
    "filename": "src/routes/page/index.js",
    "groupTitle": "Page",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"theme\": {\n      \"cover\": \"http://test.s3.amazonaws.com/test/image.jpg\"\n    },\n    \"content\": [\n      {\n        \"updated\": \"2019-04-22T20:08:00.762Z\",\n        \"created\": \"2019-04-22T20:08:00.762Z\",\n        \"text\": \"lorem ipsum\",\n        \"type\": \"text\",\n        \"style\": \"normal\",\n        \"contentId\": \"5441d5a0-653a-11e9-90f5-abd4496146e2\",\n        \"matchId\": null\n      }\n    ],\n    \"deleted\": false,\n    \"_id\": \"593f94bd17d85a0e003d3c36\",\n    \"title\": \"\",\n    \"slug\": \"page\",\n    \"author\": {\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"name\": \"John Doe\",\n      \"username\": \"johndoe\",\n      \"avatar\": null,\n      \"email\": \"johndoe@istoryapp.com\"\n    },\n    \"created\": \"2017-06-13T07:31:09.519Z\",\n    \"updated\": \"2019-04-22T20:08:00.765Z\",\n    \"dateFrom\": \"2017-06-13T07:35:07.532Z\",\n    \"dateTo\": \"2017-06-13T07:35:07.532Z\",\n    \"status\": \"public\",\n    \"deletedAt\": null,\n    \"active\": true,\n    \"matchId\": \"75c1b44c-9cbd-48ac-9e78-aff0ecbef100\",\n    \"__v\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/pages/move",
    "title": "Move page",
    "version": "1.0.0",
    "name": "movePage",
    "group": "Page",
    "description": "<p>Move page to another story</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "pageId",
            "description": "<p>Page ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "storyId",
            "description": "<p>Story ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/page/index.js",
    "groupTitle": "Page",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"content\": [\n      {\n        \"video\": null,\n        \"videoId\": null,\n        \"place\": {\n          \"addr\": \"Ulica Stojana, 21137 Central Serbia, Serbia\",\n          \"name\": \"Ulica Stojana\",\n          \"lng\": null,\n          \"lat\": \"45.25719798639906\"\n        },\n        \"date\": \"2017-06-09T07:32:17.000Z\",\n        \"matchId\": \"tF02B6DE5-C714-406D-9510-740AB08D1E959\",\n        \"updated\": \"1497339307649\",\n        \"created\": \"1497339307649\",\n        \"caption\": \"brm brm\",\n        \"contentId\": \"d0d38d91-6538-11e9-90f5-abd4496146e2\",\n        \"rtmp\": \"http://sample.s3.amazonaws.com/test/video.mp4\",\n        \"image\": \"http://sample.s3.amazonaws.com/test/image.jpg\",\n        \"url\": \"http://sample.s3.amazonaws.com/test/video.mp4\",\n        \"type\": \"video\",\n        \"size\": 120000\n      }\n    ],\n    \"deleted\": false,\n    \"_id\": \"5cbe1c96bc59553a9a1b8204\",\n    \"author\": {\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"name\": \"John Doe\",\n      \"username\": \"johndoe\",\n      \"avatar\": null,\n      \"email\": \"johndoe@istoryapp.com\"\n    },\n    \"active\": true,\n    \"status\": \"public\",\n    \"created\": \"2019-04-22T19:57:10.760Z\",\n    \"updated\": \"2019-04-22T19:57:10.760Z\",\n    \"title\": \"page Copy\",\n    \"slug\": \"page-copy\",\n    \"theme\": {\n      \"cover\": \"http://rekordr.s3.amazonaws.com/test/image.jpg\"\n    },\n    \"dateFrom\": \"2017-06-13T07:35:07.532Z\",\n    \"dateTo\": \"2017-06-13T07:35:07.532Z\",\n    \"original\": \"593f94bd17d85a0e003d3c36\",\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/pages/:id",
    "title": "Page by ID",
    "version": "1.0.0",
    "name": "pageById",
    "group": "Page",
    "description": "<p>Get page details by page ID</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Page ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/page/index.js",
    "groupTitle": "Page",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"data\": {\n   \"_id\": \"5939503417d85a0e003d3c1b\",\n   \"title\": \"\",\n   \"slug\": \"page\",\n   \"matchId\": null,\n   \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n   \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n   \"content\": [{\n     \"rtmp\": \"http://istory-videos.s3.amazonaws.com/test/video.mp4\",\n     \"place\": {\n       \"addr\": null,\n       \"name\": null,\n       \"lng\": null,\n       \"lat\": null\n     },\n     \"date\": null,\n     \"image\": \"http://istory.s3.amazonaws.com/test/image.jpg\",\n     \"matchId\": \"t327C55C1-1653-481C-81D0-8DAFEDC82B862\",\n     \"updated\": \"1496928308547\",\n     \"created\": \"1496928308547\",\n     \"caption\": null,\n     \"contentId\": \"e45b4930-4c4d-11e7-ab00-0d28db01cb06\",\n     \"url\": \"http://istory-videos.s3.amazonaws.com/test/video.mp4\",\n     \"type\": \"gif\",\n     \"size\": 3000\n   }],\n   \"theme\": {\n     \"cover\": \"\"\n   },\n   \"place\": {\n     \"lat\": null,\n     \"lon\": null,\n     \"name\": null\n   },\n   \"author\": {\n     \"_id\": \"58eb78b94b432a21008c2346\",\n     \"name\": \"user1\",\n     \"username\": \"user1\",\n     \"avatar\": \"http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n     \"email\": \"user1@gmail.com\"\n   }\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/pages/:id/contents",
    "title": "Remove content",
    "version": "1.0.0",
    "name": "removeContent",
    "group": "Page",
    "description": "<p>Remove single content element</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Page ID</p>"
          }
        ],
        "body params": [
          {
            "group": "body params",
            "type": "String",
            "optional": false,
            "field": "contentId",
            "description": "<p>content ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/page/index.js",
    "groupTitle": "Page",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"theme\": {\n      \"cover\": \"http://test.s3.amazonaws.com/test/image.jpg\"\n    },\n    \"content\": [\n      {\n        \"updated\": \"2019-04-22T20:08:00.762Z\",\n        \"created\": \"2019-04-22T20:08:00.762Z\",\n        \"text\": \"lorem ipsum\",\n        \"type\": \"text\",\n        \"style\": \"normal\",\n        \"contentId\": \"5441d5a0-653a-11e9-90f5-abd4496146e2\",\n        \"matchId\": null\n      }\n    ],\n    \"deleted\": false,\n    \"_id\": \"593f94bd17d85a0e003d3c36\",\n    \"title\": \"\",\n    \"slug\": \"page\",\n    \"author\": {\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"name\": \"John Doe\",\n      \"username\": \"johndoe\",\n      \"avatar\": null,\n      \"email\": \"johndoe@istoryapp.com\"\n    },\n    \"created\": \"2017-06-13T07:31:09.519Z\",\n    \"updated\": \"2019-04-22T20:08:00.765Z\",\n    \"dateFrom\": \"2017-06-13T07:35:07.532Z\",\n    \"dateTo\": \"2017-06-13T07:35:07.532Z\",\n    \"status\": \"public\",\n    \"deletedAt\": null,\n    \"active\": true,\n    \"matchId\": \"75c1b44c-9cbd-48ac-9e78-aff0ecbef100\",\n    \"__v\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/pages",
    "title": "Update page",
    "version": "1.0.0",
    "name": "updatePage",
    "group": "Page",
    "description": "<p>Update page by user</p>",
    "parameter": {
      "fields": {
        "body params": [
          {
            "group": "body params",
            "type": "String",
            "optional": false,
            "field": "pageId",
            "description": "<p>Page ID</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>Page title</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "matchId",
            "description": "<p>Match ID</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "cover",
            "description": "<p>Page cover</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "dateFrom",
            "description": "<p>Date from</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "dateTo",
            "description": "<p>Date to</p>"
          },
          {
            "group": "body params",
            "type": "Object",
            "optional": true,
            "field": "place",
            "description": "<p>place</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "place.name",
            "description": "<p>Place name</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "place.lat",
            "description": "<p>Place latitude</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "place.lon",
            "description": "<p>place longitude</p>"
          },
          {
            "group": "body params",
            "type": "Object[]",
            "optional": true,
            "field": "content",
            "description": "<p>Page content</p>"
          },
          {
            "group": "body params",
            "type": "String",
            "optional": true,
            "field": "content.type",
            "description": "<p>Page content type (text, audio, recording, image, gallery, gif, video)</p>"
          },
          {
            "group": "body params",
            "type": "Binary",
            "optional": true,
            "field": "content.file",
            "description": "<p>Page content file</p>"
          }
        ]
      }
    },
    "filename": "src/routes/page/index.js",
    "groupTitle": "Page",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"theme\": {\n      \"cover\": \"http://test.s3.amazonaws.com/test/image.jpg\"\n    },\n    \"content\": [\n      {\n        \"updated\": \"2019-04-22T20:08:00.762Z\",\n        \"created\": \"2019-04-22T20:08:00.762Z\",\n        \"text\": \"lorem ipsum\",\n        \"type\": \"text\",\n        \"style\": \"normal\",\n        \"contentId\": \"5441d5a0-653a-11e9-90f5-abd4496146e2\",\n        \"matchId\": null\n      }\n    ],\n    \"deleted\": false,\n    \"_id\": \"593f94bd17d85a0e003d3c36\",\n    \"title\": \"\",\n    \"slug\": \"page\",\n    \"author\": {\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"name\": \"John Doe\",\n      \"username\": \"johndoe\",\n      \"avatar\": null,\n      \"email\": \"johndoe@istoryapp.com\"\n    },\n    \"created\": \"2017-06-13T07:31:09.519Z\",\n    \"updated\": \"2019-04-22T20:08:00.765Z\",\n    \"dateFrom\": \"2017-06-13T07:35:07.532Z\",\n    \"dateTo\": \"2017-06-13T07:35:07.532Z\",\n    \"status\": \"public\",\n    \"deletedAt\": null,\n    \"active\": true,\n    \"matchId\": \"75c1b44c-9cbd-48ac-9e78-aff0ecbef100\",\n    \"__v\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/comments/:id/spam",
    "title": "Comment spam",
    "version": "1.0.0",
    "name": "spamComment",
    "group": "Spam",
    "description": "<p>Report Comment as spam if content is inappropriate</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message for spam</p>"
          },
          {
            "group": "Body params",
            "type": "Number",
            "optional": false,
            "field": "reason",
            "description": "<p>Reason as an option from the spam form</p>"
          }
        ],
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>comment ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"message\": \"You successfully report comment\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/spam/index.js",
    "groupTitle": "Spam",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/spam/pages/:id",
    "title": "Page spam",
    "version": "1.0.0",
    "name": "spamPage",
    "group": "Spam",
    "description": "<p>Report Page as spam if content is inappropriate</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>page ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"message\": \"You successfully report page\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/spam/index.js",
    "groupTitle": "Spam",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/spam/story/:id",
    "title": "Story spam",
    "version": "1.0.0",
    "name": "spamStory",
    "group": "Spam",
    "description": "<p>Report Story as spam if content is inappropriate</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>story ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": true,\n  \"message\": \"You successfully report story\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/spam/index.js",
    "groupTitle": "Spam",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/stories/collaboration",
    "title": "My collaboration",
    "version": "1.0.0",
    "name": "MyCollaboration",
    "group": "Story",
    "description": "<p>Fetch all stories where user is the coauthor.</p>",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "Boolean",
            "optional": true,
            "field": "search",
            "description": "<p>Search stories by title</p>"
          },
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"_id\": \"5939503417d85a0e403d3c26\",\n      \"title\": \"Lorem ipsum dolor 1\",\n      \"slug\": \"lorem-ipsum-dolor-1\",\n      \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2346\",\n        \"name\": \"test name\",\n        \"username\": \"test username\",\n        \"avatar\": \"http://rekordr.s3.amazonaws.com/profile//165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n        \"email\": \"testauthor@istoryapp.com\"\n      },\n      \"pages\": [{\n        \"_id\": \"5939503417d85a0e003d3c2f\",\n        \"title\": \"collaborationtest page 4\",\n        \"slug\": \"page\",\n        \"matchId\": \"17a35844-426d-4160-b2a9-de765de23525\",\n        \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"content\": [{\n          \"matchId\": \"t8E2CD216-6EC4-4C0A-B670-09527D13A22F104\",\n          \"contentId\": \"2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf\",\n          \"style\": \"normal\",\n          \"type\": \"text\",\n          \"text\": \"<p ><font face=\\\"Avenir-Book\\\" style=\\\"font-size:18px;\\\">This is the text...</font></p>\",\n          \"created\": \"1497642155559\",\n          \"updated\": \"1497642155559\"\n        }],\n        \"theme\": {\n          \"cover\": \"\"\n        },\n        \"place\": {\n          \"lat\": null,\n          \"lon\": null,\n          \"name\": null\n        },\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }],\n      \"share\": {\n        \"followers\": \"true\",\n        \"link\": \"true\",\n        \"search\": \"true\"\n      },\n      \"collaborators\": [{\n        \"edit\": \"false\",\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }]\n    }],\n    \"total\": 1,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/stories/feed",
    "title": "My feed",
    "version": "1.0.0",
    "name": "MyFeed",
    "group": "Story",
    "description": "<p>Get Stories shared with me (Stories which author internally shared with user) and public Stories created by authors followed by user</p>",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "Boolean",
            "optional": true,
            "field": "search",
            "description": "<p>Search stories by title</p>"
          },
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"_id\": \"5939503417d85a0e403d3c26\",\n      \"title\": \"Lorem ipsum dolor 1\",\n      \"slug\": \"lorem-ipsum-dolor-1\",\n      \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2346\",\n        \"name\": \"test name\",\n        \"username\": \"test username\",\n        \"avatar\": \"http://rekordr.s3.amazonaws.com/profile//165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n        \"email\": \"testauthor@istoryapp.com\"\n      },\n      \"pages\": [{\n        \"_id\": \"5939503417d85a0e003d3c2f\",\n        \"title\": \"collaborationtest page 4\",\n        \"slug\": \"page\",\n        \"matchId\": \"17a35844-426d-4160-b2a9-de765de23525\",\n        \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"content\": [{\n          \"matchId\": \"t8E2CD216-6EC4-4C0A-B670-09527D13A22F104\",\n          \"contentId\": \"2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf\",\n          \"style\": \"normal\",\n          \"type\": \"text\",\n          \"text\": \"<p ><font face=\\\"Avenir-Book\\\" style=\\\"font-size:18px;\\\">This is the text...</font></p>\",\n          \"created\": \"1497642155559\",\n          \"updated\": \"1497642155559\"\n        }],\n        \"theme\": {\n          \"cover\": \"\"\n        },\n        \"place\": {\n          \"lat\": null,\n          \"lon\": null,\n          \"name\": null\n        },\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }],\n      \"share\": {\n        \"followers\": \"true\",\n        \"link\": \"true\",\n        \"search\": \"true\"\n      },\n      \"collaborators\": [{\n        \"edit\": \"false\",\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }]\n    }],\n    \"total\": 1,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/stories/my",
    "title": "My stories",
    "version": "1.0.0",
    "name": "MyStories",
    "group": "Story",
    "description": "<p>Fetch all stories where user is the author.</p>",
    "parameter": {
      "fields": {
        "Query params": [
          {
            "group": "Query params",
            "type": "Boolean",
            "optional": true,
            "field": "deleted",
            "defaultValue": "false",
            "description": "<p>Get deleted stories using this filter</p>"
          },
          {
            "group": "Query params",
            "type": "Boolean",
            "optional": true,
            "field": "search",
            "description": "<p>Search stories by title</p>"
          },
          {
            "group": "Query params",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "name:asc",
            "description": "<p>Sort documents using specific format: <code>name:asc</code>, <code>username:desc</code>... Possible values after colon are: <strong>ascending</strong>, <strong>descending</strong>, <strong>asc</strong>, <strong>desc</strong>, <strong>1</strong>, <strong>-1</strong></p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Number of documents per page</p>"
          },
          {
            "group": "Query params",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Number of page depends on total number of documents and limit that's used</p>"
          }
        ]
      }
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"_id\": \"5939503417d85a0e403d3c26\",\n      \"title\": \"Lorem ipsum dolor 1\",\n      \"slug\": \"lorem-ipsum-dolor-1\",\n      \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2346\",\n        \"name\": \"test name\",\n        \"username\": \"test username\",\n        \"avatar\": \"http://rekordr.s3.amazonaws.com/profile//165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n        \"email\": \"testauthor@istoryapp.com\"\n      },\n      \"pages\": [{\n        \"_id\": \"5939503417d85a0e003d3c2f\",\n        \"title\": \"collaborationtest page 4\",\n        \"slug\": \"page\",\n        \"matchId\": \"17a35844-426d-4160-b2a9-de765de23525\",\n        \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"content\": [{\n          \"matchId\": \"t8E2CD216-6EC4-4C0A-B670-09527D13A22F104\",\n          \"contentId\": \"2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf\",\n          \"style\": \"normal\",\n          \"type\": \"text\",\n          \"text\": \"<p ><font face=\\\"Avenir-Book\\\" style=\\\"font-size:18px;\\\">This is the text...</font></p>\",\n          \"created\": \"1497642155559\",\n          \"updated\": \"1497642155559\"\n        }],\n        \"theme\": {\n          \"cover\": \"\"\n        },\n        \"place\": {\n          \"lat\": null,\n          \"lon\": null,\n          \"name\": null\n        },\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }],\n      \"share\": {\n        \"followers\": \"true\",\n        \"link\": \"true\",\n        \"search\": \"true\"\n      },\n      \"collaborators\": [{\n        \"edit\": \"false\",\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }]\n    }],\n    \"total\": 1,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/stories",
    "title": "Create story",
    "name": "createStory",
    "version": "1.1.0",
    "group": "Story",
    "description": "<p>Create story by user</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Story title</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "privacy_type",
            "description": "<p>Story privacy type</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "files",
            "description": "<p>files</p>"
          },
          {
            "group": "Body params",
            "type": "Binary",
            "optional": true,
            "field": "files.cover",
            "description": "<p>Story cover</p>"
          },
          {
            "group": "Body params",
            "type": "Binary",
            "optional": true,
            "field": "files.pageCover",
            "description": "<p>Page cover</p>"
          },
          {
            "group": "Body params",
            "type": "Object[]",
            "optional": true,
            "field": "collaborators",
            "description": "<p>Story collaborators</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaborators.author",
            "description": "<p>Collaborator ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "collaborators.edit",
            "description": "<p>Collaborator edit privileges</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "page",
            "description": "<p>Page on Story</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "page.title",
            "description": "<p>Page title</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "page.dateFrom",
            "description": "<p>Start date</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "page.dateTo",
            "description": "<p>End date</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": true,
            "field": "page.place",
            "description": "<p>Page location</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "page.place.id",
            "description": "<p>Location ID from Google Maps</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "page.place.name",
            "description": "<p>Location name</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "page.place.lat",
            "description": "<p>Location latitude coordinates</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": true,
            "field": "page.place.log",
            "description": "<p>Location longitude coordinates</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "matchId",
            "description": "<p>Unique ID for the page</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "content",
            "description": "<p>Page content</p>"
          }
        ]
      }
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"theme\": {\n      \"cover\": null\n    },\n    \"share\": {\n      \"followers\": false,\n      \"link\": false,\n      \"search\": false\n    },\n    \"pages\": [{\n      \"theme\": {\n        \"cover\": \"\"\n      },\n      \"content\": [{\n        \"matchId\": \"8E2CD216-6EC4-4C0A-B670-09527D13A22F105\",\n        \"contentId\": \"2a40fbb0-52cb-11e7-8dc1-7dec89033bde\",\n        \"style\": \"normal\",\n        \"type\": \"text\",\n        \"text\": \"<p ><font face=\\\"Avenir-Book\\\" style=\\\"font-size:18px;\\\">This is the text...</font></p>\",\n        \"created\": \"1497642155559\",\n        \"updated\": \"1497642155559\"\n      }],\n      \"_id\": \"593f94bd17d85a0e003d3c37\",\n      \"title\": \"page title\"\n    }],\n    \"views\": 0,\n    \"active\": true,\n    \"_id\": \"5cbe32af182070495a1fcf8a\",\n    \"author\": {\n       \"58eb78b94b432a21008c2346\",\n       \"name\": \"Test Author1\",\n       \"username\": \"testauthor1\",\n       \"avatar\": \"\",\n       \"email\": \"testauthor1@istoryapp.com\"\n    },\n    \"title\": \"New title\",\n    \"status\": \"private\",\n    \"deleted\": false,\n    \"created\": \"2019-04-22T21:31:27.156Z\",\n    \"updated\": \"2019-04-22T21:31:27.176Z\",\n    \"slug\": \"new-title\",\n    \"banInPublic\": false,\n    \"collaborators\": [],\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/stories/:id",
    "title": "Delete story",
    "version": "1.2.0",
    "name": "deleteStory",
    "group": "Story",
    "description": "<p>Delete story</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>story ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   data: \"1234567890123\",\n   message: \"The Story has been deleted\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/stories/set-privacy",
    "title": "Set privacy",
    "version": "1.0.0",
    "name": "deleteStory",
    "group": "Story",
    "description": "<p>Set privacy and share settings for the Story</p>",
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"share\": {\n      \"collaborators\": false,\n      \"followers\": false\n      \"link\": false\n      \"search\": false\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/stories/:id/favorite",
    "title": "Set story as a favorite",
    "version": "1.0.0",
    "name": "favoriteStory",
    "group": "Story",
    "description": "<p>Set the Story as a favorite for user</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   status: true,\n   message: \"The Story has been set as a favorite\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/stories/favorites",
    "title": "Get favorite Stories",
    "version": "1.0.0",
    "name": "favorites",
    "group": "Story",
    "description": "<p>Get a of favorite stories by author</p>",
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [{\n      \"_id\": \"5939503417d85a0e403d3c26\",\n      \"title\": \"Lorem ipsum dolor 1\",\n      \"slug\": \"lorem-ipsum-dolor-1\",\n      \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2346\",\n        \"name\": \"test name\",\n        \"username\": \"test username\",\n        \"avatar\": \"http://rekordr.s3.amazonaws.com/profile//165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n        \"email\": \"testauthor@istoryapp.com\"\n      },\n      \"pages\": [{\n        \"_id\": \"5939503417d85a0e003d3c2f\",\n        \"title\": \"collaborationtest page 4\",\n        \"slug\": \"page\",\n        \"matchId\": \"17a35844-426d-4160-b2a9-de765de23525\",\n        \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)\",\n        \"content\": [{\n          \"matchId\": \"t8E2CD216-6EC4-4C0A-B670-09527D13A22F104\",\n          \"contentId\": \"2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf\",\n          \"style\": \"normal\",\n          \"type\": \"text\",\n          \"text\": \"<p ><font face=\\\"Avenir-Book\\\" style=\\\"font-size:18px;\\\">This is the text...</font></p>\",\n          \"created\": \"1497642155559\",\n          \"updated\": \"1497642155559\"\n        }],\n        \"theme\": {\n          \"cover\": \"\"\n        },\n        \"place\": {\n          \"lat\": null,\n          \"lon\": null,\n          \"name\": null\n        },\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }],\n      \"share\": {\n        \"followers\": \"true\",\n        \"link\": \"true\",\n        \"search\": \"true\"\n      },\n      \"collaborators\": [{\n        \"edit\": \"false\",\n        \"author\": {\n          \"_id\": \"58eb78b94b432a21008c2347\",\n          \"name\": \"Test Author1\",\n          \"username\": \"testauthor1\",\n          \"avatar\": \"\",\n          \"email\": \"testauthor1@istoryapp.com\"\n        }\n      }]\n    }],\n    \"total\": 1,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/stories/:id/favorite",
    "title": "Remove Story from favorites",
    "version": "1.0.0",
    "name": "noFavoriteStory",
    "group": "Story",
    "description": "<p>Remove the Story from user's favorite Stories</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>story ID</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   data: true,\n   message: \"The Story has been removed from favorites\",\n   story: 1234567890\n }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/stories/:id",
    "title": "Story by ID",
    "name": "storyById",
    "version": "1.2.0",
    "group": "Story",
    "description": "<p>Get story by ID</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Story ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  HTTP/1.1 200 OK\n  {\n  \"data\": {\n    \"_id\": \"5939503417d85a0e003d3c23\",\n    \"title\": \"Shared Collaboration Story #1\",\n    \"slug\": \"shared-collaboration-story-1\",\n    \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)\",\n    \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)\",\n    \"author\": {\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"name\": \"user1\",\n      \"username\": \"user1\",\n      \"avatar\": \"http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n      \"email\": \"user1@istoryapp.com\",\n      \"isFollowed\": false\n    },\n    \"pages\": [{\n      \"_id\": \"5939503417d85a0e003d3c2f\",\n      \"title\": \"collaborationtest page 4\",\n      \"slug\": \"page\",\n      \"matchId\": null,\n      \"created\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)\",\n      \"updated\": \"Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)\",\n        \"content\": [{\n          \"matchId\": \"t8E2CD216-6EC4-4C0A-B670-09527D13A22F104\",\n          \"contentId\": \"2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf\",\n          \"style\": \"normal\",\n          \"type\": \"text\",\n          \"text\": \"<p ><font face=\\\"Avenir-Book\\\" style=\\\"font-size:18px;\\\">This is the text...</font></p>\",\n          \"created\": \"1497642155559\",\n          \"updated\": \"1497642155559\"\n        }],\n      \"theme\": {\n        \"cover\": \"\"\n      },\n      \"place\": {\n        \"lat\": null,\n        \"lon\": null,\n        \"name\": null\n      },\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2347\",\n        \"name\": \"Test Author1\",\n        \"username\": \"testauthor1\",\n        \"avatar\": \"\",\n        \"email\": \"testauthor1@istoryapp.com\"\n      }\n    }],\n    \"share\": {\n      \"followers\": \"true\",\n      \"link\": \"true\",\n      \"search\": \"true\"\n    },\n    \"collaborators\": [{\n      \"edit\": \"false\",\n      \"author\": {\n        \"_id\": \"58eb78b94b432a21008c2347\",\n        \"name\": \"Test Author1\",\n        \"username\": \"testauthor1\",\n        \"avatar\": \"\",\n        \"email\": \"testauthor1@istoryapp.com\"\n      }\n    }],\n    \"isFavorite\": true,\n    \"commentsCount\": 3,\n    \"shareLink\": \"https://istoryapp.com/testauthor1/shared-collaboration-story-1\",\n    \"edit\": true,\n    \"pagesNumber\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/stories/:id/collaborators",
    "title": "Get and search collaborators on the story",
    "version": "1.2.0",
    "name": "storyCollaborators",
    "group": "Story",
    "description": "<p>Get and search collaborators on the story</p>",
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [\n      {\n        \"_id\": \"5a538361ea64260e00eb7547\",\n        \"name\": \"John Doe\",\n        \"username\": \"johndoe\",\n        \"avatar\": null,\n        \"email\": \"johndoe@istoryapp.com\",\n        \"canInvite\": false,\n        \"edit\": true\n      },\n      {\n        \"_id\": \"5a538361ea64260e00eb7548\",\n        \"name\": \"Billy Kid\",\n        \"username\": \"billy\",\n        \"avatar\": null,\n        \"email\": \"billy.kid@istoryapp.com\"\n        \"canInvite\": true,\n        \"edit\": true\n      },\n    ],\n    \"total\": 2,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/stories/:id/pending-collaborators",
    "title": "Get and search peding collaborators on the story",
    "version": "1.2.0",
    "name": "storyCollaborators",
    "group": "Story",
    "description": "<p>Get and search pending collaborators on the story</p>",
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"docs\": [\n      {\n        \"_id\": \"5a538361ea64260e00eb7547\",\n        \"name\": \"John Doe\",\n        \"username\": \"johndoe\",\n        \"avatar\": null,\n        \"email\": \"johndoe@istoryapp.com\",\n        \"canInvite\": false,\n        \"edit\": true\n      },\n      {\n        \"_id\": \"5a538361ea64260e00eb7548\",\n        \"name\": \"Billy Kid\",\n        \"username\": \"billy\",\n        \"avatar\": null,\n        \"email\": \"billy.kid@istoryapp.com\"\n        \"canInvite\": true,\n        \"edit\": true\n      },\n    ],\n    \"total\": 2,\n    \"limit\": 10,\n    \"page\": 1,\n    \"pages\": 1\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/stories/:id/pages",
    "title": "Pages from Story by ID",
    "name": "storyPagesById",
    "version": "1.2.0",
    "group": "Story",
    "description": "<p>Get a pages from story by ID</p>",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Story ID</p>"
          }
        ]
      }
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"pages\": [{\n      \"_id\": \"5cbe3ab4f461a04e6a792096\",\n      \"title\": \"earum qui\",\n      \"slug\": \"earum-qui\",\n      \"matchId\": \"c46772d0-654a-11e9-918c-3f7acd542085\",\n      \"created\": \"Tue Apr 23 2019 00:05:40 GMT+0200 (CEST)\",\n      \"updated\": \"Tue Apr 23 2019 00:05:40 GMT+0200 (CEST)\",\n      \"content\": [{\n        \"contentId\": \"c46799e0-654a-11e9-918c-3f7acd542085\",\n        \"created\": \"2019-04-22T22:05:37.718Z\",\n        \"updated\": \"2019-04-22T22:05:37.718Z\",\n        \"text\": \"Culpa sed sit et voluptatibus voluptatum ab. Numquam iure at expedita accusamus odio fuga suscipit rem explicabo. Mollitia sequi in et et nemo ullam eaque voluptate nesciunt. Eius commodi ipsum.\",\n        \"type\": \"text\",\n        \"style\": \"normal\",\n        \"matchId\": \"c46799e1-654a-11e9-918c-3f7acd542085\"\n      }],\n      \"theme\": {\n        \"cover\": \"http://lorempixel.com/640/480/nature\"\n      },\n      \"place\": {\n        \"lat\": \"27.6650\",\n        \"lon\": \"-52.9105\",\n        \"name\": \"Port Bert\"\n      },\n      \"author\": {\n         \"_id\": \"5a538361ea64260e00eb7547\",\n         \"name\": \"Family Member 1\",\n         \"username\": \"family1\",\n         \"avatar\": null,\n         \"email\": \"family1@istory.com\"\n       },\n      \"pageNumber\": 2,\n      \"commentsNumber\": 10,\n      \"shareLink\": \"https://istoryapp.com/testauthor1/shared-collaboration-story-1/page/earum-qui\"\n    }]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/stories",
    "title": "Update story",
    "version": "1.2.0",
    "name": "updateStory",
    "group": "Story",
    "description": "<p>Update story by user</p>",
    "parameter": {
      "fields": {
        "Body params": [
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Story ID</p>"
          },
          {
            "group": "Body params",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Story title</p>"
          },
          {
            "group": "Body params",
            "type": "Object",
            "optional": false,
            "field": "files",
            "description": "<p>files</p>"
          },
          {
            "group": "Body params",
            "type": "Binary",
            "optional": true,
            "field": "files.cover",
            "description": "<p>Story cover</p>"
          },
          {
            "group": "Body params",
            "type": "Array",
            "optional": false,
            "field": "pageIds",
            "description": "<p>List of page IDs</p>"
          }
        ]
      }
    },
    "filename": "src/routes/story/index.js",
    "groupTitle": "Story",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"theme\": {\n      \"cover\": \"http://test.s3.amazonaws.com/test/image.jpg\"\n    },\n    \"share\": {\n      \"followers\": true,\n      \"link\": true,\n      \"search\": true\n    },\n    \"pages\": [{\n      \"theme\": {\n        \"cover\": \"\"\n      },\n      \"content\": [{\n        \"matchId\": \"8E2CD216-6EC4-4C0A-B670-09527D13A22F105\",\n        \"contentId\": \"2a40fbb0-52cb-11e7-8dc1-7dec89033bde\",\n        \"style\": \"normal\",\n        \"type\": \"text\",\n        \"text\": \"<p ><font face=\\\"Avenir-Book\\\" style=\\\"font-size:18px;\\\">This is the text...</font></p>\",\n        \"created\": \"1497642155559\",\n        \"updated\": \"1497642155559\"\n      }],\n      \"_id\": \"593f94bd17d85a0e003d3c37\",\n      \"title\": \"page title\"\n    }],\n    \"views\": 3,\n    \"active\": true,\n    \"_id\": \"593f94bd17d85a0e003d3c34\",\n    \"author\": {\n      \"name\": \"test name\",\n      \"avatar\": \"http://test.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg\",\n      \"_id\": \"58eb78b94b432a21008c2346\",\n      \"username\": \"test username\"\n    },\n    \"title\": \"Updated title\",\n    \"status\": \"public\",\n    \"deleted\": false,\n    \"created\": \"2017-06-13T07:31:09.303Z\",\n    \"updated\": \"2019-04-22T21:37:17.782Z\",\n    \"slug\": \"updated-title\",\n    \"banInPublic\": false,\n    \"collaborators\": [],\n    \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/sync",
    "title": "Data synchronization",
    "version": "1.2.0",
    "name": "sync",
    "group": "Sync",
    "description": "<p>Synchronize data</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "lastSync",
            "description": "<p>Last synchronization date</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "storyIds",
            "description": "<p>List of story IDs for synchronization</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plan",
            "description": "<p>Subscription plan</p>"
          }
        ]
      }
    },
    "filename": "src/routes/synchronization/index.js",
    "groupTitle": "Sync",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"stories\": [{\n      \"pages\": [{\n        \"_id\": \"5caf3ce67e7c843a4dea85d2\",\n        \"created\": \"2019-04-11T13:11:02.861Z\",\n        \"updated\": \"2019-04-11T13:11:02.861Z\",\n        \"matchId\": \"customMatchId\"\n      }],\n      \"_id\": \"5caf3ce67e7c843a4dea85d7\",\n      \"updated\": \"2019-04-11T13:11:02.940Z\",\n      \"created\": \"2019-04-11T13:11:02.940Z\"\n    }],\n    \"deletedStories\": [{\n      \"_id\": \"5caf3ce67e7c843a4dea85d9\",\n      \"deletedAt\": \"2019-03-09T00:00:00.000Z\",\n      \"updated\": \"2019-04-11T13:11:03.012Z\",\n      \"created\": \"2019-04-11T13:11:03.012Z\"\n    }],\n    \"pages\": [{\n      \"content\": [{\n        \"contentId\": \"41eb26a0-5c5b-11e9-a93b-f58c1d862236\",\n        \"created\": \"2019-04-11T13:11:02.362Z\",\n        \"updated\": \"2019-04-11T13:11:02.362Z\",\n        \"text\": \"Sunt quia itaque nulla ex in deleniti perferendis. Neque eius nam voluptatem consequuntur omnis amet fugit est quam. Ab enim est sint libero est vitae provident a. Omnis eligendi eligendi voluptatem exercitationem reiciendis.\",\n        \"type\": \"text\",\n        \"style\": \"normal\",\n        \"matchId\": \"41eb26a1-5c5b-11e9-a93b-f58c1d862236\"\n      }],\n      \"_id\": \"5caf3ce67e7c843a4dea85d3\",\n      \"title\": \"page 2\",\n      \"created\": \"2019-04-11T13:11:02.921Z\",\n      \"updated\": \"2019-04-11T13:11:02.921Z\",\n      \"matchId\": \"41eaff90-5c5b-11e9-a93b-f58c1d862236\"\n    }],\n    \"deletedPages\": [],\n    \"groups\": [],\n    \"userPlan\": {\n      \"level\": \"BASIC\",\n      \"expires\": \"2020-04-11T13:11:02.725Z\"\n    },\n    \"lastSynchronizationDate\": \"2019-04-11T13:11:03.046Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/sync/plan",
    "title": "Subscription and data usage",
    "version": "1.0.0",
    "name": "syncPlan",
    "group": "Sync",
    "description": "<p>Synchronize users subscription and data usage</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "storage",
            "description": "<p>Data usage</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "plan",
            "description": "<p>Subscription plan</p>"
          }
        ]
      }
    },
    "filename": "src/routes/synchronization/index.js",
    "groupTitle": "Sync",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"allowSync\": true,\n    \"storageUsage\": 5666822,\n    \"planLevel\": \"BASIC\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n   name: \"InternalServerError\",\n   message: \"sample InternalServerError message\",\n   statusCode: 500,\n   errorCode: 500\n}",
          "type": "json"
        },
        {
          "title": "Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n   name: \"UnprocessableEntity\",\n   message: \"sample UnprocessableEntity message\",\n   statusCode: 422,\n   errorCode: 422\n}",
          "type": "json"
        },
        {
          "title": "Bad Request",
          "content": "HTTP/1.1 502 Bad Request\n{\n   name: \"BadRequest\",\n   message: \"sample BadRequest message\",\n   statusCode: 400,\n   errorCode: 400\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized",
          "content": "HTTP/1.1 401 Unauthorized\n{\n   name: \"Unauthorized\",\n   message: \"sample Unauthorized message\",\n   statusCode: 401,\n   errorCode: 401\n}",
          "type": "json"
        }
      ]
    }
  }
] });
