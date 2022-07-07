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

## CRUD memo

## SSG + ISR with apollo client

## custom hooks + useCallback + memo
