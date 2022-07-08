## 概要

Next.js Hasura Apollo Client GraphQL を使用して、モダンな Web 開発をするために
勉強を行った時のリポジトリです。

## state Manegement について

## Integration of Next.js/ Apollo Client with Hasura

自動的に正規化される。
type_name には、field の名前が入る
Users テーブルの中から、id name created_at だけを pick で取り出している。
https://github.com/vercel/next.js/blob/canary/examples/with-apollo/lib/apolloClient.js

```typescript
const { data, loading, error } = useQuery<GetUsersQuery>(GET_USERS)
```

引数のところに実行したい query のコマンドを指定
generics で指定した query の型を指定
返り値として、data, loading, error を指定

## Direct access with cache(@client)

cache を使った state management を行う。
このデータを別のページから、@client を使って参照できるようにする。

1. redux を使わずに、一度取得したデータを cache に保存される
2. 好きなページから自由にそのデータにアクセスできるようになる

### useQuery

option で Fetchpolicy を設定できる

- cache-first
  cache が存在する場合は、常に cache を見に行く
- network-only
  useQuery が実行されるたびに、GraphQL サーバーにアクセスして最新のデータを取得して cache に保存する

```graphql
  const { data, loading, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'network-only',
  })
```

↓
network-only だと、cache の値は読みにいかず、毎回サーバーにアクセスして fetch する

```graphql
export const GET_USERS_LOCAL = gql`
  query GetUsers {
    users(order_by: { createdAt: desc }) @client {
      id
      name
      createdAt
    }
  }
`
```

↓
@client をつけることで、cache に保存される

## FUll understanding of fetfch policy

4 つの fetch policy

1. cache-first
   一旦取得したデータが cache にある場合は、それを読みに行く
   データがサーバーサイドで頻繁に変わるものは向いていない。
   サーバーサイトから取得するデータが多い場合は、効率的にデータを取得できる
   サーバーサイドの変更は取得できない
2. no-cache
   そもそも cache が作られないので、サーバーサイドのデータだけ
   通常の javascript の axios で rest api にアクセスしている時のような挙動
3. network-only
   useQuery が呼び出されるたびに、サーバーサイドにアクセスしてデータを取得して cache に保存する
   #### どういう場合に使うか

- 頻繁にサーバーサイドが更新される場合
- リアルタイムにサーバーサイドと連携する場合
  3 と 4 は、useQuery にアクセスしたときにサーバーサイドからデータを取得するのは同じだが、
  network-only は、通信の時間が 4 に比べて長いが、（通信中は何も表示されない）全部読み込まれてから、一気にデータを表示する仕様になっている。

4. cache-and-network

- useQuery に来るたびに最新のデータを取得
- 取得している間に既存の cache のデータ を表示 → 最新のデータが取得でき次第表示を更新する

例：user1 user2 user3 user4 という cache がある
→ user4update に名前を更新
→ サーバーサイドにアクセスしてデータを取得
→user1 user2 user3 user4 がちょっと表示 →user4update に変化する

### 使い分け

ほとんどの場合は 4 の cache-and-network を使えば大丈夫！

## CRUD

#### query の書き方

useQuery を使って、query を実行・データ型を generics で指定・対象の query を指定・返り値を指定する

```typescript
const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
  fetchPolicy: 'cache-and-network',
})
```

#### update

query と大体同じ

```typescript
const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)
```

#### create と delete

処理が終わった後に cache が自動的に更新されないようになっており、
自分で cache の後処理を書いておかないといけない。

- **create**
  create の処理が終わった後に、update の処理を書かないといけない。
  toReference に id を渡してあげると、insertUser

```typescript
const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
  update(cache, { data: { insert_users_one } }) {
    const cacheId = cache.identify(insert_users_one)
    cache.modify({
      fields: {
        users(existingUsers, { toReference }) {
          return [toReference(cacheId), ...existingUsers]
        },
      },
    })
  },
})
```

- **delete**
  後処理について
  → 既存の cache の配列から今削除した user を filter を使って削除するという処理

1. 今削除した user が delete_users_by_pk を取得
2. 更新したい field は users なので指定
3. 第一引数に既存の users を指定（existingUsers）
4. readField で任意の field の値 を読むことができる
5. 今回は、一致しない id 以外を filter で残すという処理

```typescript
const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
  update(cache, { data: { delete_users_by_pk } }) {
    cache.modify({
      fields: {
        users(existingUsers, { readField }) {
          return existingUsers.filter(
            (user) => delete_users_by_pk.id !== readField('id', user)
          )
        },
      },
    })
  },
})
```

## CRUD memo

- Dispatch
- SetStateAction
  useState で作られた更新用の関数のデータ型で使う

setState のデータ型

```typescript
const setEditedUser: Dispatch<
  SetStateAction<{
    id: string
    name: string
  }>
>
```

- disabled について
  *disabled={!editedUser.name}*のような感じで、name が定義されてない時に、true にするという処理を書けば、disabled になる

```typescript
<button
  disabled={!editedUser.name}
  className="disabled:opacity-40 my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
  data-testid="new"
  type="submit"
>
  {editedUser.id ? 'Update' : 'Create'}
</button>
```

- input
  valuen には、editedUser.name というように、editedUser.name にアクセスすることができる。

```typescript
<input
  type="text"
  className="px-3 py-2 border border-gray-300"
  placeholder="New User ?"
  value={editedUser.name}
  onChange={(e) => {
    setEditedUser({ ...editedUser, name: e.target.value })
  }}
/>
```

- e.preventDefault()について
  _e.preventDefault()_ は、submit イベントを抑止するためのもので、submit イベントが発生した時に、このイベントを抑止することができる
  何も指定しなければ、submit イベントが発生した時に、ページ遷移が発生してしまうらしい。

## SSG + ISR with apollo client

- GetStaticProps とは
  アプリケーションのビルド時にサーバーサイドで実行される処理

サーバーサイドで initializeApollo を実行して apolloClient を生成する
await で同期化して data を受け取るようにする

- revalidate
  incremental static regeneration が有効化される

- CSR
  client side rendering
- SSR
  server side rendering
- SSG
  static generation
- ISR とは
  incremental static regeneration
  ブログとかに使う
  リクエストに対して、静的にビルドされたページを返す＋有効期限を超えたら、非同期で静的ぺーじの再生成を SSR で行う。
  事前にデータ付きでビルドされたページを返すことができる。
  なので、JavaScript を無効化したとしても、ページを表示することができる。

#### yarn dev と yarn build

- 普通の時 →yarn dev
  ローカルサーバーを起動する
  サーバーサイドレンダリングが全て適用される
- SSG ISR のページをテストしたい

```
yarn build → yarn start
```

プロダクションサーバーをローカルで起動する必要がある

#### 個別ページを作成する

- fallback
  ture にすると、動的に個別ページを作成できる
- ISR の原理
  1. hasura 側で user4 を追加した
  2. その時にアクセスした人は古い HTML を受けとる形になるので
  3. user1 . 2 .3 が表示される
  4. その間に、最新データで HTML が再生成される。
  5. なので、次にアクセスした時に、最新データで表示される

## custom hooks + useCallback + memo
