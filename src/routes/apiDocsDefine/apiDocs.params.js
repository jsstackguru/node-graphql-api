// ! Authorization

/**
 * @apiDefine authorization
 * @apiHeader {String} Authorization Bearer token
 */

// ! Pagination params

/**
 * @apiDefine daysParam
 * @apiParam (Query params) {Number} [days=30] Look for documents in past by days prop
 */

// ! Pagination params

/**
 * @apiDefine daysParam
 * @apiParam (Query params) {Number} [days=30] Look for documents in past by days prop
 */

/**
 * @apiDefine paginationParams
 * @apiParam (Query params) {String} [sort="name:asc"] Sort documents using specific format:
 *            <code>name:asc</code>, <code>username:desc</code>...
 *            Possible values after colon are:
 *            <strong>ascending</strong>,
 *            <strong>descending</strong>,
 *            <strong>asc</strong>,
 *            <strong>desc</strong>,
 *            <strong>1</strong>,
 *            <strong>-1</strong>
 * @apiParam (Query params) {Number} [limit=10] Number of documents per page
 * @apiParam (Query params) {Number} [page=1] Number of page depends on total number of documents and limit that's used
 */

// ! Pagination params search

/**
 * @apiDefine paginationParamsSearch
 *
 * @apiParam (Query params) {String} search
 *           Search Stories (only unlocked Stories or Stories user have access for)
 *           and Authors (by username, name and email)
 *
 * @apiParam (Query params) {String} [authorSort="name:asc"] Sort documents using specific format:
 *            <code>name:asc</code>, <code>username:desc</code>...
 *            Possible values after colon are:
 *            <strong>ascending</strong>,
 *            <strong>descending</strong>,
 *            <strong>asc</strong>,
 *            <strong>desc</strong>,
 *            <strong>1</strong>,
 *            <strong>-1</strong>
 * @apiParam (Query params) {Number} [authorLimit=10] Number of documents per page
 * @apiParam (Query params) {Number} [authorPage=1] Number of page depends on total number of documents and limit that's used
 *
 * @apiParam (Query params) {String} [storySort="name:asc"] Sort documents using specific format:
 *            <code>name:asc</code>, <code>username:desc</code>...
 *            Possible values after colon are:
 *            <strong>ascending</strong>,
 *            <strong>descending</strong>,
 *            <strong>asc</strong>,
 *            <strong>desc</strong>,
 *            <strong>1</strong>,
 *            <strong>-1</strong>
 * @apiParam (Query params) {Number} [storyLimit=10] Number of documents per page
 * @apiParam (Query params) {Number} [storyPage=1] Number of page depends on total number of documents and limit that's used
 */

// ! contents filter

/**
 * @apiDefine ContentsFiltersParams
 * @apiParam (Query params) {String[] = "audios", "videos", "images"} [filter=["audios","videos","images"]]
 *            filter content based on type
 *
 */

