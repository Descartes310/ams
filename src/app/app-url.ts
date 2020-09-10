
//const SERVER_ADDR = "http://192.168.8.102:8080";
const SERVER_ADDR = "http://3.125.222.211:8080";
//const SERVER_ADDR = "https://uds-archivemanager.herokuapp.com";

const REMOTE_SERVER: string = SERVER_ADDR + "/api/";

export const SOCKET_CONNEXION: string = SERVER_ADDR + '/socket';
export const SOCKET_DESTINATION: string = '/new_archive';

export const OAUTH_TOKEN: string = SERVER_ADDR + "/oauth/token";  //post

export const OAUTH_REVOKE_TOKEN: string = SERVER_ADDR + "/oauth/revoke-token";  //delete

export const CURRENT_USER: string = REMOTE_SERVER + "current_user";  //get

export const USER_GROUPS: string = REMOTE_SERVER + "user/groups";  //get

export const GROUP_ARCHIVES: string = REMOTE_SERVER + "group/{id}/archives";  //get

export const CATEGORY_ARCHIVES: string = REMOTE_SERVER + "category/{id}/archives";  //get

export const CATEGORY_GROUPS: string = REMOTE_SERVER + "category/{id}/groups";  //get

export const USER_ARCHIVES: string = REMOTE_SERVER + "user/archives";  //get

export const METADATA_LIST: string = REMOTE_SERVER + "metadatas";  //get

export const POST_ARCHIVE: string = REMOTE_SERVER + "archive"; //post

export const ARCHIVE_METADATA_VALUE: string = REMOTE_SERVER + "archive/{id}/metadata-values";  //get

export const SEARCH_ARCHIVE: string = REMOTE_SERVER + "user/search";  //get

export const COVER_RESOURCE: string = REMOTE_SERVER + 'cover';  //get

export const PDF_RESOURCE: string = REMOTE_SERVER + 'pdf';  //get

export const FORGOT_PASSWORD: string =  SERVER_ADDR + '/forgot-password';  //get

export const SOFT_DELETE_ARCHIVE: string = REMOTE_SERVER + 'archive/{id}'; //delete

export const HARD_DELETE_ARCHIVE: string = REMOTE_SERVER + 'archive/{id}/delete'; //delete

export const ARCHIVE_GET_DELETED_AT: string = REMOTE_SERVER + 'archive/{id}/deleted_at'; //get

export const GET_ARCHIVE_BY_ID: string = REMOTE_SERVER + 'archive/{id}'; //get

export const TRASHED_ARCHIVE: string = REMOTE_SERVER + 'archive/trashed'; //get

export const ARCHIVES_SINCE_LAST_LOGOUT: string = REMOTE_SERVER + 'archive/since_last_logout'; //get

export const RESTORE_ARCHIVE: string = REMOTE_SERVER + 'archive/{id}/restore';  //delete

export const RESTORE_ALL_ARCHIVE: string = REMOTE_SERVER + 'archive/restore-all';  //delete

export const EXPORT_ARCHIVES: string = REMOTE_SERVER + 'export';  //get

export const UPDATE_LAST_LOGIN: string = REMOTE_SERVER + 'update_last_login';  //patch

export const UPDATE_LAST_LOGOUT: string = REMOTE_SERVER + 'update_last_logout';  //patch

export const USER_AVATAR: string = REMOTE_SERVER + 'avatar';  //get

export const CHANGE_AVATAR: string = REMOTE_SERVER + 'avatar';  //post

export const UPDATE_USER: string = REMOTE_SERVER + 'user';  //put

export const CHANGE_PASSWORD: string = REMOTE_SERVER + 'user/password';  //patch

export const CATEGORIES: string = REMOTE_SERVER + 'categories';  //get

export const GET_PRIVILEGES: string = REMOTE_SERVER + 'user/privileges';  //get

export const USER_LIST: string = REMOTE_SERVER + 'users';  //get


//post
export const ADD_GROUP: string = REMOTE_SERVER + "admin/group";
export const ADD_CATEGORY: string = REMOTE_SERVER + "admin/category";
export const ADD_ROLE: string = REMOTE_SERVER + "admin/role";
export const ADD_USER: string = REMOTE_SERVER + "admin/user";
export const ADD_METADATA: string = REMOTE_SERVER + "admin/metadata";
export const ADD_STORAGE: string = REMOTE_SERVER + "admin/storage";
export const ADD_PLANNIFICATION: string = REMOTE_SERVER + "admin/plannification";
//export const ADD_GROUP_MEMBER: string = REMOTE_SERVER + "admin/groupMembers";

//get
export const GROUPS: string = REMOTE_SERVER + "admin/groups";
export const ADMIN_CATEGORIES: string = REMOTE_SERVER + "admin/categories";
export const ROLES: string = REMOTE_SERVER + "admin/roles";
export const TYPES_OF_FILES: string =REMOTE_SERVER + "admin/typeOfFiles";
export const USERS: string = REMOTE_SERVER + "admin/users";
export const PRIVILEGES: string = REMOTE_SERVER + "admin/privileges";
export const LOGS: string = REMOTE_SERVER + "admin/logs";
export const STORAGES: string = REMOTE_SERVER + "admin/storages";
export const METADATAS: string = REMOTE_SERVER + "admin/metadatas";
export const PLANNIFICATIONS: string = REMOTE_SERVER + "admin/plannifications";
export const NEXT_PLANNIFICATIONS: string = REMOTE_SERVER + "admin/nextplannifications";

//get
export const GROUP: string = REMOTE_SERVER + "admin/group";
export const ADMIN_CATEGORY: string = REMOTE_SERVER + "admin/categorie";
export const ROLE: string = REMOTE_SERVER + "admin/role";
export const USER: string = REMOTE_SERVER + "admin/user";
export const PRIVILEGE: string = REMOTE_SERVER + "admin/privilege";
export const STORAGE: string = REMOTE_SERVER + "admin/storage";
export const METADATA: string = REMOTE_SERVER + "admin/metadata";
export const CATEGORY: string = REMOTE_SERVER + "admin/category";
export const PLANNIFICATION: string = REMOTE_SERVER + "admin/plannification";


//post
export const BLOCK_USER: string = REMOTE_SERVER + "admin/user/block";
export const BLOCK_CATEGORY: string = REMOTE_SERVER + "admin/category/block";
export const BLOCK_PLANNIFICATION: string =REMOTE_SERVER + "admin/plannification/block";
export const ACTIVE_STORAGE: string = REMOTE_SERVER + "admin/active";

//get
export const REPLICATE: string = REMOTE_SERVER + "admin/replicate";

//put
export const EDIT_GROUP: string = REMOTE_SERVER + "admin/group";
export const EDIT_TYPES_OF_FILES: string = REMOTE_SERVER + "admin/edit_types_of_files";
export const EDIT_CATEGORY: string = REMOTE_SERVER + "admin/category";
export const EDIT_ROLE: string = REMOTE_SERVER + "admin/role";
export const EDIT_USER: string = REMOTE_SERVER + "admin/user";
export const EDIT_METADATA: string = REMOTE_SERVER + "admin/metadata";
export const EDIT_STORAGE: string = REMOTE_SERVER + "admin/storage";
export const EDIT_PLANNIFICATION: string = REMOTE_SERVER + "admin/plannification";

//post
export const DELETE_GROUP: string = REMOTE_SERVER + "admin/group/delete";
export const DELETE_ROLE: string = REMOTE_SERVER + "admin/role/delete";
export const DELETE_CATEGORY: string = REMOTE_SERVER + "admin/category/delete";
//export const DELETE_CATEGORY_METADATA: string =REMOTE_SERVER + "category/remove/metadata";
export const DELETE_USER: string = REMOTE_SERVER + "admin/user/delete";
export const DELETE_PLANNIFICATION: string = REMOTE_SERVER + "admin/plannification/delete";
export const DELETE_LOG: string = REMOTE_SERVER + "admin/log/delete";
export const DELETE_LOGS: string = REMOTE_SERVER + "admin/logs/delete";
export const DELETE_METADATA: string = REMOTE_SERVER + "admin/metadata/delete";
//export const REMOVE_GROUP_MEMBER: string = REMOTE_SERVER + "admin/group/remove/member";


