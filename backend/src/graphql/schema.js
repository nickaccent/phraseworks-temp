import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type MediaSettings {
        settings: String
    }

    type Categories {
        categories: [Category]
    }

    type Category {
        term_id: Int
        name: String
        slug: String
        description: String
        post_count: Int
    }

    type NavPosts {
        posts: [NavPost]
        total: Int
    }

    type NavPost {
        id: Int
        post_name: String
        post_type: String
        child_count: Int
    }

    type Posts {
        posts: [Post]
        total: Int
    }

    type Post {
        id: Int!
        post_date: String!
        post_date_gmt: String!
        post_content: String!
        post_title: String!
        post_excerpt: String
        post_status: String!
        post_password: String
        post_name: String
        post_modified: String
        post_modified_gmt: String
        post_parent: Int
        guid: String
        menu_order: Int
        post_type: String
        post_mime_type: String
        comment_count: Int
        post_author: Int
        author: User
        featured_image_id: Int
        featured_image_metadata: String
    }

    type Files {
        files: [File]
        total: Int
    }

    type File {
        id: Int
        filename: String!
        mimetype: String!
        encoding: String
        url: String!
        date: String
        author: User
        attachment_metadata: String
    }

    type User {
        id: Int
        user_login: String
        user_nicename: String
        user_email: String
        user_url: String
        user_registered: String
        user_activation_key: String
        user_status: String
        display_name: String
        first_name: String
        last_name: String
    }
        
    type AuthData {
        token: String!
        refreshToken: String!
        userId: String!
        user: [User]
    }

    type SuccessData {
        success: Boolean!
        error: String
        post_id: Int
    }

    input SystemCreateInput {
        email: String!
        first_name: String!
        last_name: String!
        display_name: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        refresh(refreshToken: String!): AuthData!
        systemCheck: SuccessData!
        getMediaFiles(folder: String, offset: Int!, type: String, search: String): Files 
        getMediaFileById(id: Int): File
        getMediaSettings: MediaSettings!
        getPostsAndPagesNavigation: NavPosts!
        getPosts(page: Int!, perPage: Int!, type: String!, include_trash: Int!): Posts!
        getPostsByStatus(page: Int!, perPage: Int!, type: String!, status: String!): Posts!
        getPostsByAuthor(page: Int!, perPage: Int!, type: String!, author_id: Int!): Posts!
        getPostBy(field: String!, value: String!): Post
        getCategories(type: String!): Categories!
    }

    type RootMutation {
        systemCreate(input: SystemCreateInput!): SuccessData!
        deleteFiles(ids: [Int]!): SuccessData!
        updateMediaSettings(data: String!): SuccessData!
        createDraftNewPost(title: String, content: String, featuredImageId: Int): SuccessData!
        createPublishNewPost(title: String, content: String, featuredImageId: Int): SuccessData!
        updatePost(title: String, content: String, featuredImageId: Int, postId: Int!): SuccessData!
        updatePostStatus(status: String!, post_id: Int!): SuccessData!
        updatePostPublishDate(date: String!, post_id: Int!): SuccessData!
        updatePostPassword(password: String!, post_id: Int!): SuccessData!
    }

    schema {
        query: RootQuery,
        mutation: RootMutation
    } 
`);

export default schema;
