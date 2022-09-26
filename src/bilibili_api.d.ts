export interface MessageAPIResult {
  code: number;
  message: string;
  ttl: number;
  data: Data;
}
export interface Data {
  has_more: boolean;
  items?: (ItemsEntity)[] | null;
  offset: string;
  update_baseline: string;
  update_num: number;
}
export interface ItemsEntity {
  basic: Basic;
  id_str: string;
  modules: Modules;
  type: 'DYNAMIC_TYPE_AV' | 'DYNAMIC_TYPE_DRAW' | 'DYNAMIC_TYPE_FORWARD' | 'DYNAMIC_TYPE_WORD';
  visible: boolean;
  orig?: Orig | null;
}
export interface Basic {
  comment_id_str: string;
  comment_type: number;
  like_icon: LikeIcon;
  rid_str: string;
}
export interface LikeIcon {
  action_url: string;
  end_url: string;
  id: number;
  start_url: string;
}
export interface Modules {
  module_author: ModuleAuthor;
  module_dynamic: ModuleDynamic;
  module_interaction: ModuleInteraction;
  module_more: ModuleMore;
  module_stat: ModuleStat;
  module_tag?: ModuleTag | null;
}
export interface ModuleAuthor {
  face: string;
  face_nft: boolean;
  following?: null;
  jump_url: string;
  label: string;
  mid: number;
  name: string;
  official_verify: OfficialVerify;
  pendant: Pendant;
  pub_action: string;
  pub_location_text: string;
  pub_time: string;
  pub_ts: number;
  type: string;
  vip: Vip;
}
export interface OfficialVerify {
  desc: string;
  type: number;
}
export interface Pendant {
  expire: number;
  image: string;
  image_enhance: string;
  image_enhance_frame: string;
  name: string;
  pid: number;
}
export interface Vip {
  avatar_subscript: number;
  avatar_subscript_url: string;
  due_date: number;
  label: Label;
  nickname_color: string;
  status: number;
  theme_type: number;
  type: number;
}
export interface Label {
  bg_color: string;
  bg_style: number;
  border_color: string;
  img_label_uri_hans: string;
  img_label_uri_hans_static: string;
  img_label_uri_hant: string;
  img_label_uri_hant_static: string;
  label_theme: string;
  path: string;
  text: string;
  text_color: string;
  use_img_label: boolean;
}
export interface ModuleDynamic {
  additional?: Additional | null;
  desc?: Desc | null;
  major?: Major | null;
  topic?: Topic | null;
}
export interface Additional {
  reserve: Reserve;
  type: string;
}
export interface Reserve {
  button: Button;
  desc1: Desc1;
  desc2: Desc2;
  desc3: Desc3;
  jump_url: string;
  reserve_total: number;
  rid: number;
  state: number;
  stype: number;
  title: string;
  up_mid: number;
}
export interface Button {
  check: Check;
  status: number;
  type: number;
  uncheck: Uncheck;
}
export interface Check {
  icon_url: string;
  text: string;
}
export interface Uncheck {
  disable: number;
  icon_url: string;
  text: string;
  toast: string;
}
export interface Desc1 {
  style: number;
  text: string;
}
export interface Desc2 {
  style: number;
  text: string;
  visible: boolean;
}
export interface Desc3 {
  jump_url: string;
  style: number;
  text: string;
}
export interface Desc {
  rich_text_nodes?: (RichTextNodesEntity)[] | null;
  text: string;
}
export interface RichTextNodesEntity {
  orig_text: string;
  rid?: string | null;
  text: string;
  type: string;
  emoji?: Emoji | null;
}
export interface Emoji {
  icon_url: string;
  size: number;
  text: string;
  type: number;
}
export interface Major {
  draw?: Draw | null;
  type: string;
  archive?: Archive | null;
}
export interface Draw {
  id: number;
  items?: (ItemsEntity1)[] | null;
}
export interface ItemsEntity1 {
  height: number;
  size: number;
  src: string;
  tags?: (null)[] | null;
  width: number;
}
export interface Archive {
  aid: string;
  badge: Badge;
  bvid: string;
  cover: string;
  desc: string;
  disable_preview: number;
  duration_text: string;
  jump_url: string;
  stat: Stat;
  title: string;
  type: number;
}
export interface Badge {
  bg_color: string;
  color: string;
  text: string;
}
export interface Stat {
  danmaku: string;
  play: string;
}
export interface Topic {
  id: number;
  jump_url: string;
  name: string;
}
export interface ModuleInteraction {
  items?: (ItemsEntity2)[] | null;
}
export interface ItemsEntity2 {
  desc: Desc4;
  type: number;
}
export interface Desc4 {
  rich_text_nodes?: (RichTextNodesEntity1)[] | null;
  text: string;
}
export interface RichTextNodesEntity1 {
  orig_text: string;
  rid?: string | null;
  text: string;
  type: string;
}
export interface ModuleMore {
  three_point_items?: (ThreePointItemsEntity)[] | null;
}
export interface ThreePointItemsEntity {
  label: string;
  type: string;
}
export interface ModuleStat {
  comment: CommentOrForward;
  forward: CommentOrForward;
  like: Like;
}
export interface CommentOrForward {
  count: number;
  forbidden: boolean;
}
export interface Like {
  count: number;
  forbidden: boolean;
  status: boolean;
}
export interface ModuleTag {
  text: string;
}
export interface Orig {
  basic: Basic;
  id_str: string;
  modules: Modules1;
  type: 'DYNAMIC_TYPE_AV' | 'DYNAMIC_TYPE_DRAW' | 'DYNAMIC_TYPE_FORWARD' | 'DYNAMIC_TYPE_WORD';
  visible: boolean;
}
export interface Modules1 {
  module_author: ModuleAuthor1;
  module_dynamic: ModuleDynamic1;
}
export interface ModuleAuthor1 {
  face: string;
  face_nft: boolean;
  following?: null;
  jump_url: string;
  label: string;
  mid: number;
  name: string;
  official_verify: OfficialVerify;
  pendant: Pendant;
  pub_action: string;
  pub_time: string;
  pub_ts: number;
  type: string;
  vip: Vip;
}
export interface ModuleDynamic1 {
  additional?: null;
  desc?: Desc5 | null;
  major: Major1;
  topic?: null;
}
export interface Desc5 {
  rich_text_nodes?: (RichTextNodesEntity2)[] | null;
  text: string;
}
export interface RichTextNodesEntity2 {
  orig_text: string;
  rid?: string | null;
  text: string;
  type: string;
  emoji?: Emoji | null;
  jump_url?: string | null;
}
export interface Major1 {
  draw?: Draw | null;
  type: string;
  archive?: Archive | null;
}
