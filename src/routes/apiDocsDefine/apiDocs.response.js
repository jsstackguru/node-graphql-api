/*************************/
/*** AUTHOR'S RESPONSES ***/
/*************************/

// ! Author register

/**
 * @apiDefine authorRegistrationResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "_id": "5cb9c583ba41473057b6c60b",
 *        "name": "123",
 *        "username": "test123",
 *        "avatar": "",
 *        "token": {
 *          "access": "V8sud9mUn6jhDCaPKpCJR064lIuxm_3Fcf6_xbVrgQ4",
 *          "refresh": "V51diIX3xZ0n3tSfSLBc9WE95wO3obwpgySddeAqD1f0RciF0Z6sXvRkQq0fxbxw"
 *        },
 *        "email": "test@test.com",
 *        "bio": "",
 *        "plan": {
 *          "level": "BASIC",
 *          "expires": null
 *        },
 *        "storage": {
 *          "usage": 0
 *        }
 *      }
 *    }
 */

// ! Login user

/**
 * @apiDefine authorLoginResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "_id": "58eb78b94b432a21008c2346",
 *        "name": "test user",
 *        "username": "test user",
 *        "avatar": "http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *        "bio": "bio",
 *        "location": {
 *          "name": "Novi Sad",
 *          "lon": "19.8369444",
 *          "lat": "45.2516667"
 *        },
 *        "token": {
 *          "access": "8ug7V79qH4U8soZ7oJ6qhRqaNHFJA2Wt",
 *          "refresh": "NAH0HUftmmvc3KL7pJUTWwVFiNlxFlHw",
 *          "expired": "2022-06-07T08:55:25.000Z"
 *        },
 *        "email": "testuser@istoryapp.com",
 *        "plan": {
 *          "level": "BASIC"
 *        },
 *        "storage": {
 *          "usage": 10240
 *        },
 *        "notif": {
 *          "collaboration": {
 *            "userLeavesStory": true,
 *            "removedFromStory": true,
 *            "storyUpdates": true,
 *            "newCollaborator": true,
 *            "invitations": true
 *          },
 *          "social": {
 *            "newFollower": true,
 *            "comments": true,
 *            "favoritedYourStory": true,
 *            "sharedStory": true,
 *            "friendStoryUpdates": true,
 *            "friendNewStory": true,
 *            "newFriend": true
 *          }
 *        },
 *        "pushNotif": {
 *          "newStoryShare": true,
 *          "newStoryPublic": true,
 *          "newFollower": true,
 *          "newComment": true
 *        },
 *        "sync": {
 *          "lastCheck": null
 *        },
 *        "firstTime": true
 *      }
 *    }
 */

// ! Update profile

/**
 * @apiDefine authorUpdateProfileResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "_id": "5cb9c583ba41473057b6c60b",
 *        "name": "123",
 *        "username": "test123",
 *        "avatar": "",
 *        "token": {
 *          "access": "V8sud9mUn6jhDCaPKpCJR064lIuxm_3Fcf6_xbVrgQ4",
 *          "refresh": "V51diIX3xZ0n3tSfSLBc9WE95wO3obwpgySddeAqD1f0RciF0Z6sXvRkQq0fxbxw"
 *        },
 *        "email": "test@test.com",
 *        "bio": "",
 *        "plan": {
 *          "level": "BASIC",
 *          "expires": null
 *        },
 *        "storage": {
 *          "usage": 0
 *        }
 *      }
 *    }
 */

// ! Save settings for notifications

/**
 * @apiDefine saveSettingNotificationsResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "You successfully saved settings for notifications",
 *      "data": {
 *        "_id": "58eb78b94b432a21008c2346",
 *        "name": "test name",
 *        "username": "test username",
 *        "avatar": "http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *        "token": {
 *          "access": "8ug7V79qH4U8soZ7oJ6qhRqaNHFJA2Wt"
 *        },
 *        "email": "testuser@istoryapp.com",
 *        "bio": "Test bio",
 *        "notif": {
 *          "collaboration": {
 *            "userLeavesStory": true,
 *            "removedFromStory": false,
 *            "storyUpdates": false,
 *            "newCollaborator": true,
 *            "invitations": false
 *          },
 *          "social": {
 *            "newFollower": false,
 *            "comments": true,
 *            "favoritedYourStory": false,
 *            "sharedStory": false,
 *            "friendStoryUpdates": true,
 *            "friendNewStory": false,
 *            "newFriend": false
 *          }
 *        }
 *      }
 *    }
 */

// ! Save settings for push notifications

/**
 * @apiDefine saveSettingPushNotificationsResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "You successfully saved settings for push notifications",
 *      "data": {
 *        "_id": "58eb78b94b432a21008c2346",
 *        "name": "test name",
 *        "username": "test username",
 *        "avatar": "http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *        "token": {
 *          "access": "8ug7V79qH4U8soZ7oJ6qhRqaNHFJA2Wt"
 *        },
 *        "email": "testuser@istoryapp.com",
 *        "bio": "test bio",
 *        "pushNotif": {
 *          "newStoryShare": true,
 *          "newStoryPublic": false,
 *          "newFollower": false,
 *          "newComment": true
 *        }
 *      }
 *    }
 */

// ! Delete authors account

/**
 * @apiDefine deleteAuthorsAccountResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "You successfully deleted account",
 *      "data": {
 *        "_id": "5a538361ea64260e00eb7546",
 *        "name": "test author",
 *        "username": "test author",
 *        "avatar": null,
 *        "email": "testauthor@istoryapp.com",
 *        "bio": "",
 *        "active": false,
 *        "deleted": true,
 *        "deletedAt": "2019-04-19T13:57:55.721Z"
 *      }
 *    }
 */

// ! Authors profile response

/**
 * @apiDefine basicAuthorResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "_id": "5a538361ea64260e00eb7546",
 *        "name": "test name",
 *        "username": "test username",
 *        "avatar": null,
 *        "email": "testauthor@istoryapp.com",
 *        "bio": "My story...",
 *        "stories": {
 *          "total": 0
  *        },
  *        "following": {
  *          "total": 0
  *        },
  *        "followers": {
  *            "total": 0
  *        }
 *      }
 *    }
 */

// ! Authors search response

/**
 * @apiDefine authorsSearchResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [
 *          {
 *            "_id": "5a538361ea64260e00eb7547",
 *            "name": "Group Member 1",
 *            "username": "group1",
 *            "avatar": null,
 *            "email": "group1@istoryapp.com",
 *            "isFollowed": false
 *          },
 *          {
 *            "_id": "5a538361ea64260e00eb7548",
 *            "name": "Group Member 2",
 *            "username": "group2",
 *            "avatar": null,
 *            "email": "group2@istoryapp.com",
 *            "isFollowed": true
 *          },
 *        ],
 *        "total": 2,
 *        "limit": 10,
 *        "page": 1,
 *        "pages": 1
 *      }
 *    }
 */

/*************************/
/*** STORIES RESPONSES ***/
/*************************/

// ! basic story pagination response

/**
 * @apiDefine storiesBasicPagination
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *         "docs": [{
 *           "_id": "5939503417d85a0e403d3c26",
 *           "title": "Lorem ipsum dolor 1",
 *           "slug": "lorem-ipsum-dolor-1",
 *           "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)",
 *           "updated": "Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)",
 *           "author": {
 *             "_id": "58eb78b94b432a21008c2346",
 *             "name": "test name",
 *             "username": "test username",
 *             "avatar": "http://rekordr.s3.amazonaws.com/profile//165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *             "email": "testauthor@istoryapp.com"
 *           },
 *           "pages": [{
 *             "_id": "5939503417d85a0e003d3c2f",
 *             "title": "collaborationtest page 4",
 *             "slug": "page",
 *             "matchId": "17a35844-426d-4160-b2a9-de765de23525",
 *             "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)",
 *             "updated": "Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)",
 *             "content": [{
 *               "matchId": "t8E2CD216-6EC4-4C0A-B670-09527D13A22F104",
 *               "contentId": "2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf",
 *               "style": "normal",
 *               "type": "text",
 *               "text": "<p ><font face=\"Avenir-Book\" style=\"font-size:18px;\">This is the text...</font></p>",
 *               "created": "1497642155559",
 *               "updated": "1497642155559"
 *             }],
 *             "theme": {
 *               "cover": ""
 *             },
 *             "place": {
 *               "lat": null,
 *               "lon": null,
 *               "name": null
 *             },
 *             "author": {
 *               "_id": "58eb78b94b432a21008c2347",
 *               "name": "Test Author1",
 *               "username": "testauthor1",
 *               "avatar": "",
 *               "email": "testauthor1@istoryapp.com"
 *             }
 *           }],
 *           "share": {
 *             "followers": "true",
 *             "link": "true",
 *             "search": "true"
 *           },
 *           "collaborators": [{
 *             "edit": "false",
 *             "author": {
 *               "_id": "58eb78b94b432a21008c2347",
 *               "name": "Test Author1",
 *               "username": "testauthor1",
 *               "avatar": "",
 *               "email": "testauthor1@istoryapp.com"
 *             }
 *           }]
 *         }],
 *         "total": 1,
 *         "limit": 10,
 *         "page": 1,
 *         "pages": 1
 *       }
 *     }
 */

// ! stories basic

/**
 * @apiDefine storiesBasic
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "data": {
 *       "_id": "5939503417d85a0e003d3c23",
 *       "title": "Shared Collaboration Story #1",
 *       "slug": "shared-collaboration-story-1",
 *       "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)",
 *       "updated": "Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)",
 *       "author": {
 *         "_id": "58eb78b94b432a21008c2346",
 *         "name": "user1",
 *         "username": "user1",
 *         "avatar": "http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *         "email": "user1@istoryapp.com"
 *       },
 *       "pages": [{
 *         "_id": "5939503417d85a0e003d3c2f",
 *         "title": "collaborationtest page 4",
 *         "slug": "page",
 *         "matchId": null,
 *         "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)",
 *         "updated": "Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)",
 *           "content": [{
 *             "matchId": "t8E2CD216-6EC4-4C0A-B670-09527D13A22F104",
 *             "contentId": "2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf",
 *             "style": "normal",
 *             "type": "text",
 *             "text": "<p ><font face=\"Avenir-Book\" style=\"font-size:18px;\">This is the text...</font></p>",
 *             "created": "1497642155559",
 *             "updated": "1497642155559"
 *           }],
 *         "theme": {
 *           "cover": ""
 *         },
 *         "place": {
 *           "lat": null,
 *           "lon": null,
 *           "name": null
 *         },
 *         "author": {
 *           "_id": "58eb78b94b432a21008c2347",
 *           "name": "Test Author1",
 *           "username": "testauthor1",
 *           "avatar": "",
 *           "email": "testauthor1@istoryapp.com"
 *         }
 *       }],
 *       "share": {
 *         "followers": "true",
 *         "link": "true",
 *         "search": "true"
 *       },
 *       "collaborators": [{
 *         "edit": "false",
 *         "author": {
 *           "_id": "58eb78b94b432a21008c2347",
 *           "name": "Test Author1",
 *           "username": "testauthor1",
 *           "avatar": "",
 *           "email": "testauthor1@istoryapp.com"
 *         }
 *       }]
 *     }
 *   }
 */

// ! Story crete response

/**
 * @apiDefine storyCreateResponse
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *         "theme": {
 *           "cover": null
 *         },
 *         "share": {
 *           "followers": false,
 *           "link": false,
 *           "search": false
 *         },
 *         "pages": [{
 *           "theme": {
 *             "cover": ""
 *           },
 *           "content": [{
 *             "matchId": "8E2CD216-6EC4-4C0A-B670-09527D13A22F105",
 *             "contentId": "2a40fbb0-52cb-11e7-8dc1-7dec89033bde",
 *             "style": "normal",
 *             "type": "text",
 *             "text": "<p ><font face=\"Avenir-Book\" style=\"font-size:18px;\">This is the text...</font></p>",
 *             "created": "1497642155559",
 *             "updated": "1497642155559"
 *           }],
 *           "_id": "593f94bd17d85a0e003d3c37",
 *           "title": "page title"
 *         }],
 *         "views": 0,
 *         "active": true,
 *         "_id": "5cbe32af182070495a1fcf8a",
 *         "author": {
 *            "58eb78b94b432a21008c2346",
 *            "name": "Test Author1",
 *            "username": "testauthor1",
 *            "avatar": "",
 *            "email": "testauthor1@istoryapp.com"
 *         },
 *         "title": "New title",
 *         "status": "private",
 *         "deleted": false,
 *         "created": "2019-04-22T21:31:27.156Z",
 *         "updated": "2019-04-22T21:31:27.176Z",
 *         "slug": "new-title",
 *         "banInPublic": false,
 *         "collaborators": [],
 *         "__v": 0
 *       }
 *     }
 */

// ! Story update response

/**
 * @apiDefine storyUpdateResponse
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *         "theme": {
 *           "cover": "http://test.s3.amazonaws.com/test/image.jpg"
 *         },
 *         "share": {
 *           "followers": true,
 *           "link": true,
 *           "search": true
 *         },
 *         "pages": [{
 *           "theme": {
 *             "cover": ""
 *           },
 *           "content": [{
 *             "matchId": "8E2CD216-6EC4-4C0A-B670-09527D13A22F105",
 *             "contentId": "2a40fbb0-52cb-11e7-8dc1-7dec89033bde",
 *             "style": "normal",
 *             "type": "text",
 *             "text": "<p ><font face=\"Avenir-Book\" style=\"font-size:18px;\">This is the text...</font></p>",
 *             "created": "1497642155559",
 *             "updated": "1497642155559"
 *           }],
 *           "_id": "593f94bd17d85a0e003d3c37",
 *           "title": "page title"
 *         }],
 *         "views": 3,
 *         "active": true,
 *         "_id": "593f94bd17d85a0e003d3c34",
 *         "author": {
 *           "name": "test name",
 *           "avatar": "http://test.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *           "_id": "58eb78b94b432a21008c2346",
 *           "username": "test username"
 *         },
 *         "title": "Updated title",
 *         "status": "public",
 *         "deleted": false,
 *         "created": "2017-06-13T07:31:09.303Z",
 *         "updated": "2019-04-22T21:37:17.782Z",
 *         "slug": "updated-title",
 *         "banInPublic": false,
 *         "collaborators": [],
 *         "__v": 0
 *       }
 *     }
 */

// ! Story delete response

/**
 * @apiDefine storyDeleteResponse
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "You successfully deleted story",
 *       "data": {
 *         "theme": {
 *           "cover": "http://test.s3.amazonaws.com/test/image.jpg"
 *         },
 *         "share": {
 *           "followers": true,
 *           "link": true,
 *           "search": true
 *         },
 *         "pages": [],
 *         "views": 3,
 *         "active": false,
 *         "_id": "593f94bd17d85a0e003d3c34",
 *         "author": "58eb78b94b432a21008c2346",
 *         "title": "Story #1",
 *         "status": "public",
 *         "deleted": true,
 *         "created": "2017-06-13T07:31:09.303Z",
 *         "updated": "2019-04-22T21:45:41.652Z",
 *         "slug": "story-1",
 *         "banInPublic": false,
 *         "collaborators": [],
 *         "__v": 1,
 *         "deletedAt": "2019-04-22T21:45:41.651Z"
 *       }
 *     }
 */

// ! page basic

/**
 * @apiDefine pageBasic
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *     "data": {
 *       "_id": "5939503417d85a0e003d3c1b",
 *       "title": "",
 *       "slug": "page",
 *       "matchId": null,
 *       "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)",
 *       "updated": "Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)",
 *       "content": [{
 *         "rtmp": "http://istory-videos.s3.amazonaws.com/test/video.mp4",
 *         "place": {
 *           "addr": null,
 *           "name": null,
 *           "lng": null,
 *           "lat": null
 *         },
 *         "date": null,
 *         "image": "http://istory.s3.amazonaws.com/test/image.jpg",
 *         "matchId": "t327C55C1-1653-481C-81D0-8DAFEDC82B862",
 *         "updated": "1496928308547",
 *         "created": "1496928308547",
 *         "caption": null,
 *         "contentId": "e45b4930-4c4d-11e7-ab00-0d28db01cb06",
 *         "url": "http://istory-videos.s3.amazonaws.com/test/video.mp4",
 *         "type": "gif",
 *         "size": 3000
 *       }],
 *       "theme": {
 *         "cover": ""
 *       },
 *       "place": {
 *         "lat": null,
 *         "lon": null,
 *         "name": null
 *       },
 *       "author": {
 *         "_id": "58eb78b94b432a21008c2346",
 *         "name": "user1",
 *         "username": "user1",
 *         "avatar": "http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *         "email": "user1@gmail.com"
 *       }
 *     }
 *    }
 *
 */

/**************************/
/*** COMMENTS RESPONSES ***/
/**************************/

// ! create comments response

/**
 * @apiDefine postNewCommentResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "active": true,
 *        "deleted": false,
 *        "_id": "5cbdd41fe5c56318868e12e7",
 *        "author": {
 *          "name": "test name",
 *          "avatar": "http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *          "_id": "58eb78b94b432a21008c2346",
 *          "username": "test username",
 *          "email": "testauthor@istoryapp.com"
 *        },
 *        "page": "593f94bd17d85a0e003d3c36",
 *        "text": "hej",
 *        "created": "2019-04-22T14:47:59.646Z",
 *        "spam": 0,
 *        "reply": null,
 *        "updated": "2019-04-22T14:47:59.646Z",
 *        "__v": 0
 *      }
 *    }
 */

// ! create comments reply  response

/**
 * @apiDefine postNewCommentReplyResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "active": true,
 *        "deleted": false,
 *        "_id": "5cbdd41fe5c56318868e12e7",
 *        "author": {
 *          "name": "test name",
 *          "avatar": "http://rekordr.s3.amazonaws.com/profile/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *          "_id": "58eb78b94b432a21008c2346",
 *          "username": "test username",
 *          "email": "testauthor@istoryapp.com"
 *        },
 *        "page": "593f94bd17d85a0e003d3c36",
 *        "text": "hej",
 *        "created": "2019-04-22T14:47:59.646Z",
 *        "spam": 0,
 *        "reply": {
 *          "_id": "5b29f711d216c70e00c357b7",
 *          "author": {
 *            "name": "nikson1",
 *             "avatar": "The_Earth_seen_from_Apollo_17.jpg",
 *             "_id": "5c9bce90e456bc4729c31d8b",
 *             "email": "mnikson@gmail.com",
 *             "username": "nikson",
 *             "id": "5c9bce90e456bc4729c31d8b"
 *           },
 *           "page": "5cd2a809c3a46b0c34d0cf15",
 *           "text": "Comment"
 *        },
 *        "updated": "2019-04-22T14:47:59.646Z",
 *        "__v": 0
 *      }
 *    }
 */

// ! comments basic pagination response

/**
 * @apiDefine commentsBasicPaginationResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [{
 *          "_id": "58eb78b94b432a21008c2348",
 *          "page": "593f94bd17d85a0e003d3c36",
 *          "text": "komentar 2",
 *          "created": "Fri Apr 20 2018 08:11:27 GMT+0200 (Central European Summer Time)",
 *          "spam": 0,
 *          "reply": null,
 *          "author": {
 *            "_id": "5a538361ea64260e00eb7546",
 *            "name": "testAuthor",
 *            "username": "testAuthor",
 *            "avatar": null,
 *            "email": "testauthor@istory.com"
 *          }
 *        }],
 *        "total": 5,
 *        "limit": 1,
 *        "page": 2,
 *        "pages": 5
 *      }
 *    }
 *
 */

 // ! comments details pagination response

 /**
 * @apiDefine commentsDetailsPaginationResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [{
 *          "_id": "58eb78b94b432a21008c2348",
 *          "page": "593f94bd17d85a0e003d3c36",
 *          "text": "komentar 2",
 *          "created": "Fri Apr 20 2018 08:11:27 GMT+0200 (Central European Summer Time)",
 *          "spam": 0,
 *          "reply": {},
 *          "author": {
 *            "_id": "5a538361ea64260e00eb7546",
 *            "name": "testAuthor",
 *            "username": "testAuthor",
 *            "avatar": null,
 *            "email": "testauthor@istory.com"
 *          }
 *        }],
 *        "total": 5,
 *        "limit": 1,
 *        "page": 2,
 *        "pages": 5
 *      }
 *    }
 *
 */

// ! storage response

/**
 * @apiDefine storageResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "author": {
 *          "total": {
 *            "bytes": 512000,
 *            "format": "500 KB"
 *          },
 *          "used": {
 *            "bytes": 10240,
 *            "format": "10 KB"
 *          },
 *          "left": {
 *            "bytes": 501760,
 *            "format": "490 KB"
 *          }
 *        },
 *        "members": {
 *          "you": {
 *            "bytes": 10240,
 *            "format": "10 KB"
 *          },
 *          "others": {
 *            "bytes": 5791180,
 *            "format": "5.52 MB"
 *          },
 *          "left": {
 *            "bytes": 100080180,
 *            "format": "95.44 MB"
 *          },
 *          "total": {
 *            "bytes": 105881600,
 *            "format": "100.98 MB"
 *          }
 *        }
 *      }
 *    }
 *
 */

// ! check new followers response

/**
 * @apiDefine checkNewFollowersResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [{
 *            "_id": "58eb78b94b432a21008c2347",
 *            "name": "Test Author1",
 *            "username": "testauthor1",
 *            "avatar": "",
 *            "email": "testauthor1@istoryapp.com"
 *          },
 *          {
 *            "_id": "58eb78b94b432a21008c2348",
 *            "name": "Test Author2",
 *            "username": "testauthor2",
 *            "avatar": "",
 *            "email": "testauthor2@istoryapp.com"
 *          },
 *        ],
 *        "total": 2,
 *        "limit": 10,
 *        "page": 1,
 *        "pages": 1
 *      }
 *    }
 */

// ! check new comments response

/**
 * @apiDefine checkNewCommentsResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "timelineComments": {
 *          "total": 1
 *        },
 *        "newSocialComments": {
 *          "total": 3
 *        },
 *        "newCollaborationComments": {
 *          "total": 0
 *        },
 *      }
 *    }
 */

// ! check new invites response

/**
 * @apiDefine checkNewInvitesResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [{
 *          "author": {
 *            "_id": "5a538361ea64260e00eb7547",
 *            "name": "Family Member 1",
 *            "username": "family1",
 *            "avatar": null,
 *            "email": "family1@istoryapp.com"
 *          },
 *          "invited": {
 *            "_id": "58eb78b94b432a21008c2346",
 *            "name": "test author",
 *            "username": "test author",
 *            "avatar": "http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3.jpeg",
 *            "email": "testauthor@istoryapp.com"
 *          },
 *          "story": {
 *            "_id": "593f94bd17d85a0e003d3c34",
 *            "title": "Story #1",
 *            "created": "Tue Jun 13 2017 09:31:09 GMT+0200 (Central European Summer Time)"
 *          },
 *          "created": "Tue Feb 19 2019 14:28:39 GMT+0100 (Central European Standard Time)",
 *          "_id": "5c6c0487e4ded13093911dfd"
 *        }],
 *        "total": 4,
 *        "limit": 1,
 *        "page": 1,
 *        "pages": 4
 *      }
 *    }
 */

// ! search response

/**
 * @apiDefine searchResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "stories": {
 *          "docs": [{
 *              "_id": "5b2fb7e2d216c70e00c357f7",
 *              "title": "test story 1",
 *              "created": "Sun Jun 24 2018 17:25:22 GMT+0200 (Central European Summer Time)",
 *              "slug": "dsadwq",
 *              "created": "Wed May 08 2019 09:50:01 GMT+0200 (CEST)",
 *              "updated": "Wed May 08 2019 12:02:14 GMT+0200 (CEST)",
 *              "author": {
 *                  "_id": "5c9bce90e456bc4729c31d8b",
 *                  "name": "nikson1",
 *                  "username": "nikson",
 *                  "avatar": "The_Earth_seen_from_Apollo_17.jpg",
 *                  "email": "mnikson@gmail.com",
 *                  "isFollowed": false
 *              },
 *              "pages": [],
 *              "share": {
 *                  "followers": "false",
 *                  "link": "false",
 *                  "search": "false"
 *              },
 *              "collaborators": [],
 *              "isFavorite": null,
 *              "commentsCount": 0,
 *              "shareLink": "https://istoryapp.com/undefined/story/dsadwq",
 *              "edit": true,
 *              "pagesNumber": 0
 *          },
 *          {
 *              "_id": "5939503417d85a0e003d3c23",
 *              "title": "test story 2",
 *              "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)",
 *              "slug": "dsadwq",
 *              "created": "Wed May 08 2019 09:50:01 GMT+0200 (CEST)",
 *              "updated": "Wed May 08 2019 12:02:14 GMT+0200 (CEST)",
 *              "author": {
 *                  "_id": "5c9bce90e456bc4729c31d8b",
 *                  "name": "nikson1",
 *                  "username": "nikson",
 *                  "avatar": "The_Earth_seen_from_Apollo_17.jpg",
 *                  "email": "mnikson@gmail.com",
 *                  "isFollowed": false
 *              },
 *              "pages": [],
 *              "share": {
 *                  "followers": "false",
 *                  "link": "false",
 *                  "search": "false"
 *              },
 *              "collaborators": [],
 *              "isFavorite": null,
 *              "commentsCount": 0,
 *              "shareLink": "https://istoryapp.com/undefined/story/dsadwq",
 *              "edit": true,
 *              "pagesNumber": 0
 *            }
 *          ],
 *          "total": 2,
 *          "limit": 2,
 *          "page": 1,
 *          "pages": 1
 *        },
 *        "authors": {
 *          "docs": [{
 *              "_id": "5a538361ea64260e00eb7546",
 *              "name": "Test author 5",
 *              "username": "tester",
 *              "avatar": null,
 *              "email": "testauthor5@istory.com"
 *            },
 *            {
 *              "_id": "58eb78b94b432a21008c2348",
 *              "name": "Test Author2",
 *              "username": "testauthor2",
 *              "avatar": "",
 *              "email": "testauthor2@istory.com"
 *            }
 *          ],
 *          "total": 2,
 *          "limit": 2,
 *          "page": 1,
 *          "pages": 1
 *        }
 *      }
 *    }
 */

/**
 * @apiDefine storyCollaboratorsResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [
 *          {
 *            "_id": "5a538361ea64260e00eb7547",
 *            "name": "John Doe",
 *            "username": "johndoe",
 *            "avatar": null,
 *            "email": "johndoe@istoryapp.com",
 *            "canInvite": false,
 *            "edit": true
 *          },
 *          {
 *            "_id": "5a538361ea64260e00eb7548",
 *            "name": "Billy Kid",
 *            "username": "billy",
 *            "avatar": null,
 *            "email": "billy.kid@istoryapp.com"
 *            "canInvite": true,
 *            "edit": true
 *          },
 *        ],
 *        "total": 2,
 *        "limit": 10,
 *        "page": 1,
 *        "pages": 1
 *      }
 *    }
 */

/****************************/
/*** ACTIVITIES RESPONSES ***/
/****************************/

// ! activities timeline response

/**
 * @apiDefine activitiesTimelineResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [{
 *          "author": {
 *            "_id": "58eb78b94b432a21008c2346",
 *            "name": "sasha",
 *            "username": "sasha",
 *            "avatar": "http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *            "email": "sasateodorovic57@istoryapp.com"
 *          },
 *          "story": {
 *            "_id": "5939503417d85a0e003d3c23",
 *            "title": "Shared Collaboration Story #1",
 *            "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (Central European Summer Time)"
 *          },
 *          "contents": [{
 *            "height": 1080,
 *            "width": 1920,
 *            "duration": {
 *              "seconds": 10,
 *              "raw": "00:00:10.17"
 *            },
 *            "size": 7751272,
 *            "video": null,
 *            "videoId": null,
 *            "place": {
 *              "addr": "sample street 67–79, 11111, Neverland",
 *              "name": "sample street 67–79",
 *              "lon": "19.79655638891873",
 *              "lat": "45.25497524173112"
 *            },
 *            "date": "2018-10-03T09:36:16.649Z",
 *            "matchId": "t17C47200-2227-400D-9242-72BAC67CF17527",
 *            "updated": "2018-07-11 16:26:09+0200",
 *            "created": "2018-07-11 16:26:09+0200",
 *            "caption": "idemooo",
 *            "contentId": "424ef710-c7a6-11e8-b4c5-2971eb1d35e1",
 *            "rtmp": "rtmp://s22evx7jej0vhx.cloudfront.net/5ba9d942c61d3c0f00ec0e44/42823c10-c7a6-11e8-b4c5-2971eb1d35e1.mov",
 *            "image": "http://images/5ba9d942c61d3c0f00ec0e44/42be0c90-c7a6-11e8-b4c5-2971eb1d35e1.jpg",
 *            "url": "http://videos/a9d942c61d3c0f00ec0e44/42823c10-c7a6-11e8-b4c5-2971eb1d35e1.mov",
 *            "type": "video"
 *          }],
 *          "type": "new_content"
 *        }],
 *        "total": 4,
 *        "limit": 1,
 *        "page": 4,
 *        "pages": 4
 *      }
 *    }
 *
 */

// ! activities collaboration response

/**
 * @apiDefine activitiesCollaborationResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [{
 *          "author": {
 *            "_id": "58eb78b94b432a21008c2346",
 *            "name": "user 1",
 *            "username": "user 1",
 *            "avatar": "http://istory/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *            "email": "user1@istory.com"
 *          },
 *          "story": {
 *            "_id": "593f94bd17d85a0e003d3c34",
 *            "title": "Story #1",
 *            "created": "Tue Jun 13 2017 09:31:09 GMT+0200 (Central European Summer Time)"
 *          },
 *          "collaborator": {
 *            "_id": "5a538361ea64260e00eb7546",
 *            "name": "user 2",
 *            "username": "user 2",
 *            "avatar": null,
 *            "email": "user2@istory.com"
 *          },
 *          "type": "collaboration_removed",
 *          "created": "Wed Jul 11 2018 14:56:09 GMT+0200 (Central European Summer Time)"
 *        }],
 *        "total": 4,
 *        "limit": 1,
 *        "page": 1,
 *        "pages": 4
 *      }
 *    }
 */

// ! activities social response

/**
 * @apiDefine activitiesSocialResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "docs": [{
 *            "author": {
 *              "_id": "5a538361ea64260e00eb7547",
 *              "name": "Family Member 1",
 *              "username": "family1",
 *              "avatar": null,
 *              "email": "family1@istory.com"
 *            },
 *            "story": {
 *              "_id": "5c75541d4eae16236d413ae3",
 *              "title": "new story title",
 *              "created": "Tue Feb 26 2019 15:58:37 GMT+0100 (Central European Standard Time)"
 *            },
 *            "message": null,
 *            "type": "story_created",
 *            "created": "Tue Feb 26 2019 15:58:37 GMT+0100 (Central European Standard Time)"
 *          },
 *          {
 *            "author": null,
 *            "story": null,
 *            "message": "test message",
 *            "type": "system_message",
 *            "created": "Wed Jul 11 2018 11:26:09 GMT+0200 (Central European Summer Time)"
 *          }
 *        ],
 *        "total": 3,
 *        "limit": 2,
 *        "page": 1,
 *        "pages": 2
 *      }
 *    }
 */

/**
 * @apiDefine pagesList
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "pages": [{
 *          "_id": "5cbe3ab4f461a04e6a792096",
 *          "title": "earum qui",
 *          "slug": "earum-qui",
 *          "matchId": "c46772d0-654a-11e9-918c-3f7acd542085",
 *          "created": "Tue Apr 23 2019 00:05:40 GMT+0200 (CEST)",
 *          "updated": "Tue Apr 23 2019 00:05:40 GMT+0200 (CEST)",
 *          "content": [{
 *            "contentId": "c46799e0-654a-11e9-918c-3f7acd542085",
 *            "created": "2019-04-22T22:05:37.718Z",
 *            "updated": "2019-04-22T22:05:37.718Z",
 *            "text": "Culpa sed sit et voluptatibus voluptatum ab. Numquam iure at expedita accusamus odio fuga suscipit rem explicabo. Mollitia sequi in et et nemo ullam eaque voluptate nesciunt. Eius commodi ipsum.",
 *            "type": "text",
 *            "style": "normal",
 *            "matchId": "c46799e1-654a-11e9-918c-3f7acd542085"
 *          }],
 *          "theme": {
 *            "cover": "http://lorempixel.com/640/480/nature"
 *          },
 *          "place": {
 *            "lat": "27.6650",
 *            "lon": "-52.9105",
 *            "name": "Port Bert"
 *          },
 *          "author": {
 *             "_id": "5a538361ea64260e00eb7547",
 *             "name": "Family Member 1",
 *             "username": "family1",
 *             "avatar": null,
 *             "email": "family1@istory.com"
 *           },
 *        }]
 *      }
 *    }
 */

/**
 * @apiDefine followersResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *          "followers": {
 *              "docs": [{
 *                  "_id": "58eb78b94b432a21008c2347",
 *                  "name": "Test Author1",
 *                  "username": "testauthor1",
 *                  "avatar": "",
 *                  "email": "testauthor1@istoryapp.com"
 *              }],
 *              "total": 1,
 *              "limit": 10,
 *              "page": 1,
 *              "pages": 1
 *          }
 *      }
 *    }
 */

/**
 * @apiDefine followingsResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *          "following": {
 *              "docs": [{
 *                  "_id": "58eb78b94b432a21008c2347",
 *                  "name": "Test Author1",
 *                  "username": "testauthor1",
 *                  "avatar": "",
 *                  "email": "testauthor1@istoryapp.com"
 *              }],
 *              "total": 1,
 *              "limit": 10,
 *              "page": 1,
 *              "pages": 1
 *          }
 *      }
 *    }
 */

/**********************/
/*** SYNC RESPONSES ***/
/**********************/

// ! sync response

/**
 * @apiDefine syncResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "stories": [{
 *          "pages": [{
 *            "_id": "5caf3ce67e7c843a4dea85d2",
 *            "created": "2019-04-11T13:11:02.861Z",
 *            "updated": "2019-04-11T13:11:02.861Z",
 *            "matchId": "customMatchId"
 *          }],
 *          "_id": "5caf3ce67e7c843a4dea85d7",
 *          "updated": "2019-04-11T13:11:02.940Z",
 *          "created": "2019-04-11T13:11:02.940Z"
 *        }],
 *        "deletedStories": [{
 *          "_id": "5caf3ce67e7c843a4dea85d9",
 *          "deletedAt": "2019-03-09T00:00:00.000Z",
 *          "updated": "2019-04-11T13:11:03.012Z",
 *          "created": "2019-04-11T13:11:03.012Z"
 *        }],
 *        "pages": [{
 *          "content": [{
 *            "contentId": "41eb26a0-5c5b-11e9-a93b-f58c1d862236",
 *            "created": "2019-04-11T13:11:02.362Z",
 *            "updated": "2019-04-11T13:11:02.362Z",
 *            "text": "Sunt quia itaque nulla ex in deleniti perferendis. Neque eius nam voluptatem consequuntur omnis amet fugit est quam. Ab enim est sint libero est vitae provident a. Omnis eligendi eligendi voluptatem exercitationem reiciendis.",
 *            "type": "text",
 *            "style": "normal",
 *            "matchId": "41eb26a1-5c5b-11e9-a93b-f58c1d862236"
 *          }],
 *          "_id": "5caf3ce67e7c843a4dea85d3",
 *          "title": "page 2",
 *          "created": "2019-04-11T13:11:02.921Z",
 *          "updated": "2019-04-11T13:11:02.921Z",
 *          "matchId": "41eaff90-5c5b-11e9-a93b-f58c1d862236"
 *        }],
 *        "deletedPages": [],
 *        "groups": [],
 *        "userPlan": {
 *          "level": "BASIC",
 *          "expires": "2020-04-11T13:11:02.725Z"
 *        },
 *        "lastSynchronizationDate": "2019-04-11T13:11:03.046Z"
 *      }
 *    }
 */
// ! syncPlan response

/**
 * @apiDefine syncPlanResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "allowSync": true,
 *        "storageUsage": 5666822,
 *        "planLevel": "BASIC"
 *      }
 *    }
 */

//  ! set share response
/**
 * @apiDefine setShareResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "share": {
 *          "collaborators": false,
 *          "followers": false
 *          "link": false
 *          "search": false
 *        }
 *      }
 *    }
 */

/********************************/
/*** COLLABORATOR'S RESPONSES ***/
/********************************/

//  ! collaboration leave response
/**
 * @apiDefine collaborationLeaveResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "You successfully leaved story",
 *      "data": {
 *        "theme": {
 *          "cover": null
 *        },
 *        "share": {
 *          "followers": false,
 *          "link": false,
 *          "search": false
 *        },
 *        "pages": [
 *          "5cbdc76d0cda18158e4bf350"
 *        ],
 *        "views": 0,
 *        "active": true,
 *        "_id": "5cbdc76d0cda18158e4bf34f",
 *        "title": "corporis quaerat - your pages",
 *        "status": "private",
 *        "collaborators": [],
 *        "created": "2019-04-22T13:53:49.399Z",
 *        "updated": "2019-04-22T13:53:49.418Z",
 *        "deleted": false,
 *        "banInPublic": false,
 *        "featured": false,
 *        "author": "5cbdc76d0cda18158e4bf331",
 *        "__v": 0
 *      }
 *    }
 */

//  ! collaboration remove response
/**
 * @apiDefine collaborationRemoveResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Users are removed from collaboration",
 *      "data": [{
 *        "theme": {
 *          "cover": null
 *        },
 *        "share": {
 *          "followers": false,
 *          "link": false,
 *          "search": false
 *        },
 *        "pages": [
 *          "5cbdc93d0cda18158e4bf877"
 *        ],
 *        "views": 0,
 *        "active": true,
 *        "_id": "5cbdc93d0cda18158e4bf876",
 *        "title": "eum eum - your pages",
 *        "status": "private",
 *        "collaborators": [],
 *        "created": "2019-04-22T14:01:33.665Z",
 *        "updated": "2019-04-22T14:01:33.683Z",
 *        "deleted": false,
 *        "banInPublic": false,
 *        "featured": false,
 *        "author": "5cbdc93d0cda18158e4bf864",
 *        "__v": 0
 *      }]
 *    }
 */

/************************/
/*** PAGE'S RESPONSES ***/
/************************/

//  ! Page copy response
/**
 * @apiDefine pageCopyResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "content": [
 *          {
 *            "video": null,
 *            "videoId": null,
 *            "place": {
 *              "addr": "Ulica Stojana, 21137 Central Serbia, Serbia",
 *              "name": "Ulica Stojana",
 *              "lng": null,
 *              "lat": "45.25719798639906"
 *            },
 *            "date": "2017-06-09T07:32:17.000Z",
 *            "matchId": "tF02B6DE5-C714-406D-9510-740AB08D1E959",
 *            "updated": "1497339307649",
 *            "created": "1497339307649",
 *            "caption": "brm brm",
 *            "contentId": "d0d38d91-6538-11e9-90f5-abd4496146e2",
 *            "rtmp": "http://sample.s3.amazonaws.com/test/video.mp4",
 *            "image": "http://sample.s3.amazonaws.com/test/image.jpg",
 *            "url": "http://sample.s3.amazonaws.com/test/video.mp4",
 *            "type": "video",
 *            "size": 120000
 *          }
 *        ],
 *        "deleted": false,
 *        "_id": "5cbe1c96bc59553a9a1b8204",
 *        "author": {
 *          "_id": "58eb78b94b432a21008c2346",
 *          "name": "John Doe",
 *          "username": "johndoe",
 *          "avatar": null,
 *          "email": "johndoe@istoryapp.com"
 *        },
 *        "active": true,
 *        "status": "public",
 *        "created": "2019-04-22T19:57:10.760Z",
 *        "updated": "2019-04-22T19:57:10.760Z",
 *        "title": "page Copy",
 *        "slug": "page-copy",
 *        "theme": {
 *          "cover": "http://rekordr.s3.amazonaws.com/test/image.jpg"
 *        },
 *        "dateFrom": "2017-06-13T07:35:07.532Z",
 *        "dateTo": "2017-06-13T07:35:07.532Z",
 *        "original": "593f94bd17d85a0e003d3c36",
 *        "__v": 0
 *      }
 *    }
 */

//  ! Insert content response
/**
 * @apiDefine insertContentResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "theme": {
 *          "cover": "http://test.s3.amazonaws.com/test/image.jpg"
 *        },
 *        "content": [
 *          {
 *            "updated": "2019-04-22T20:08:00.762Z",
 *            "created": "2019-04-22T20:08:00.762Z",
 *            "text": "lorem ipsum",
 *            "type": "text",
 *            "style": "normal",
 *            "contentId": "5441d5a0-653a-11e9-90f5-abd4496146e2",
 *            "matchId": null
 *          }
 *        ],
 *        "deleted": false,
 *        "_id": "593f94bd17d85a0e003d3c36",
 *        "title": "",
 *        "slug": "page",
 *        "author": {
 *          "_id": "58eb78b94b432a21008c2346",
 *          "name": "John Doe",
 *          "username": "johndoe",
 *          "avatar": null,
 *          "email": "johndoe@istoryapp.com"
 *        },
 *        "created": "2017-06-13T07:31:09.519Z",
 *        "updated": "2019-04-22T20:08:00.765Z",
 *        "dateFrom": "2017-06-13T07:35:07.532Z",
 *        "dateTo": "2017-06-13T07:35:07.532Z",
 *        "status": "public",
 *        "deletedAt": null,
 *        "active": true,
 *        "matchId": "75c1b44c-9cbd-48ac-9e78-aff0ecbef100",
 *        "__v": 1
 *      }
 *    }
 */

//  ! Create new page response
/**
 * @apiDefine createNewPageResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "content": [{
 *        "updated": "2019-04-22T20:23:55.451Z",
 *        "created": "2019-04-22T20:23:55.451Z",
 *        "text": "this is the text element",
 *        "type": "text",
 *        "style": "normal",
 *        "contentId": "8d4bd0b0-653c-11e9-b97c-454c9b7f9566",
 *        "matchId": "1234"
 *      }],
 *      "deleted": false,
 *      "_id": "5cbe22db28b92b3e7acde09c",
 *      "author": {
 *        "_id": "58eb78b94b432a21008c2346",
 *        "name": "John Doe",
 *        "username": "johndoe",
 *        "avatar": null,
 *        "email": "johndoe@istoryapp.com"
 *      },
 *      "title": "new page",
 *      "slug": "new-page",
 *      "status": "public",
 *      "active": true,
 *      "created": "2019-04-22T20:23:55.446Z",
 *      "updated": "2019-04-22T20:23:55.458Z",
 *      "__v": 1
 *    }
 */

/**
 * @apiDefine storyDetails
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "data": {
 *       "_id": "5939503417d85a0e003d3c23",
 *       "title": "Shared Collaboration Story #1",
 *       "slug": "shared-collaboration-story-1",
 *       "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)",
 *       "updated": "Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)",
 *       "author": {
 *         "_id": "58eb78b94b432a21008c2346",
 *         "name": "user1",
 *         "username": "user1",
 *         "avatar": "http://istory.s3.amazonaws.com/profile/58eb78b94b432a21008c2346/165627e0-1de9-11e7-aeb3-d3719b357d20.jpeg",
 *         "email": "user1@istoryapp.com",
 *         "isFollowed": false
 *       },
 *       "pages": [{
 *         "_id": "5939503417d85a0e003d3c2f",
 *         "title": "collaborationtest page 4",
 *         "slug": "page",
 *         "matchId": null,
 *         "created": "Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)",
 *         "updated": "Thu Jun 08 2017 15:25:08 GMT+0200 (CEST)",
 *           "content": [{
 *             "matchId": "t8E2CD216-6EC4-4C0A-B670-09527D13A22F104",
 *             "contentId": "2a40fbb0-52cb-11e7-8dc1-7d9c89033bdf",
 *             "style": "normal",
 *             "type": "text",
 *             "text": "<p ><font face=\"Avenir-Book\" style=\"font-size:18px;\">This is the text...</font></p>",
 *             "created": "1497642155559",
 *             "updated": "1497642155559"
 *           }],
 *         "theme": {
 *           "cover": ""
 *         },
 *         "place": {
 *           "lat": null,
 *           "lon": null,
 *           "name": null
 *         },
 *         "author": {
 *           "_id": "58eb78b94b432a21008c2347",
 *           "name": "Test Author1",
 *           "username": "testauthor1",
 *           "avatar": "",
 *           "email": "testauthor1@istoryapp.com"
 *         }
 *       }],
 *       "share": {
 *         "followers": "true",
 *         "link": "true",
 *         "search": "true"
 *       },
 *       "collaborators": [{
 *         "edit": "false",
 *         "author": {
 *           "_id": "58eb78b94b432a21008c2347",
 *           "name": "Test Author1",
 *           "username": "testauthor1",
 *           "avatar": "",
 *           "email": "testauthor1@istoryapp.com"
 *         }
 *       }],
 *       "isFavorite": true,
 *       "commentsCount": 3,
 *       "shareLink": "https://istoryapp.com/testauthor1/shared-collaboration-story-1",
 *       "edit": true,
 *       "pagesNumber": 1
 *     }
 *   }
 */

/**
 * @apiDefine storyPagesList
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "pages": [{
 *          "_id": "5cbe3ab4f461a04e6a792096",
 *          "title": "earum qui",
 *          "slug": "earum-qui",
 *          "matchId": "c46772d0-654a-11e9-918c-3f7acd542085",
 *          "created": "Tue Apr 23 2019 00:05:40 GMT+0200 (CEST)",
 *          "updated": "Tue Apr 23 2019 00:05:40 GMT+0200 (CEST)",
 *          "content": [{
 *            "contentId": "c46799e0-654a-11e9-918c-3f7acd542085",
 *            "created": "2019-04-22T22:05:37.718Z",
 *            "updated": "2019-04-22T22:05:37.718Z",
 *            "text": "Culpa sed sit et voluptatibus voluptatum ab. Numquam iure at expedita accusamus odio fuga suscipit rem explicabo. Mollitia sequi in et et nemo ullam eaque voluptate nesciunt. Eius commodi ipsum.",
 *            "type": "text",
 *            "style": "normal",
 *            "matchId": "c46799e1-654a-11e9-918c-3f7acd542085"
 *          }],
 *          "theme": {
 *            "cover": "http://lorempixel.com/640/480/nature"
 *          },
 *          "place": {
 *            "lat": "27.6650",
 *            "lon": "-52.9105",
 *            "name": "Port Bert"
 *          },
 *          "author": {
 *             "_id": "5a538361ea64260e00eb7547",
 *             "name": "Family Member 1",
 *             "username": "family1",
 *             "avatar": null,
 *             "email": "family1@istory.com"
 *           },
 *          "pageNumber": 2,
 *          "commentsNumber": 10,
 *          "shareLink": "https://istoryapp.com/testauthor1/shared-collaboration-story-1/page/earum-qui"
 *        }]
 *      }
 *    }
 */

/**
 * @apiDefine profileResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "_id": "5cb9c583ba41473057b6c60b",
 *        "name": "123",
 *        "username": "test123",
 *        "avatar": "",
 *        "email": "test@test.com",
 *        "bio": "",
 *        "storage": {
 *          "usage": 0
 *        },
 *        "stories": {
 *          "total": 2
 *        },
 *        "following": {
 *           "total": 0
 *        },
 *        "followers": {
 *           "total": 0
 *        }
 *      }
 *    }
 */

/**
 * @apiDefine myProfileResponse
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "_id": "5a538361ea64260e00eb7546",
 *        "name": "test name",
 *        "username": "test username",
 *        "avatar": null,
 *        "email": "testauthor@istoryapp.com",
 *        "bio": "My story...",
 *        "stories": {
 *          "total": 0
 *        },
 *        "following": {
 *          "total": 0
 *        },
 *        "followers": {
 *            "total": 0
 *        }
 *      }
 *    }
 */
