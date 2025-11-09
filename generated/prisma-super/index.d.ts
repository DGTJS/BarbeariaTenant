
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Plan
 * 
 */
export type Plan = $Result.DefaultSelection<Prisma.$PlanPayload>
/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model Promotion
 * 
 */
export type Promotion = $Result.DefaultSelection<Prisma.$PromotionPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model LandingPageImage
 * 
 */
export type LandingPageImage = $Result.DefaultSelection<Prisma.$LandingPageImagePayload>
/**
 * Model LandingPageConfig
 * 
 */
export type LandingPageConfig = $Result.DefaultSelection<Prisma.$LandingPageConfigPayload>
/**
 * Model Report
 * 
 */
export type Report = $Result.DefaultSelection<Prisma.$ReportPayload>
/**
 * Model ExpirationNotification
 * 
 */
export type ExpirationNotification = $Result.DefaultSelection<Prisma.$ExpirationNotificationPayload>
/**
 * Model SuperAdminAccess
 * 
 */
export type SuperAdminAccess = $Result.DefaultSelection<Prisma.$SuperAdminAccessPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Plans
 * const plans = await prisma.plan.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Plans
   * const plans = await prisma.plan.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plans
    * const plans = await prisma.plan.findMany()
    * ```
    */
  get plan(): Prisma.PlanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.promotion`: Exposes CRUD operations for the **Promotion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Promotions
    * const promotions = await prisma.promotion.findMany()
    * ```
    */
  get promotion(): Prisma.PromotionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.landingPageImage`: Exposes CRUD operations for the **LandingPageImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LandingPageImages
    * const landingPageImages = await prisma.landingPageImage.findMany()
    * ```
    */
  get landingPageImage(): Prisma.LandingPageImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.landingPageConfig`: Exposes CRUD operations for the **LandingPageConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LandingPageConfigs
    * const landingPageConfigs = await prisma.landingPageConfig.findMany()
    * ```
    */
  get landingPageConfig(): Prisma.LandingPageConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.report`: Exposes CRUD operations for the **Report** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.report.findMany()
    * ```
    */
  get report(): Prisma.ReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.expirationNotification`: Exposes CRUD operations for the **ExpirationNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExpirationNotifications
    * const expirationNotifications = await prisma.expirationNotification.findMany()
    * ```
    */
  get expirationNotification(): Prisma.ExpirationNotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.superAdminAccess`: Exposes CRUD operations for the **SuperAdminAccess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SuperAdminAccesses
    * const superAdminAccesses = await prisma.superAdminAccess.findMany()
    * ```
    */
  get superAdminAccess(): Prisma.SuperAdminAccessDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Plan: 'Plan',
    Tenant: 'Tenant',
    Subscription: 'Subscription',
    Promotion: 'Promotion',
    ChatMessage: 'ChatMessage',
    LandingPageImage: 'LandingPageImage',
    LandingPageConfig: 'LandingPageConfig',
    Report: 'Report',
    ExpirationNotification: 'ExpirationNotification',
    SuperAdminAccess: 'SuperAdminAccess'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "plan" | "tenant" | "subscription" | "promotion" | "chatMessage" | "landingPageImage" | "landingPageConfig" | "report" | "expirationNotification" | "superAdminAccess"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Plan: {
        payload: Prisma.$PlanPayload<ExtArgs>
        fields: Prisma.PlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findFirst: {
            args: Prisma.PlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findMany: {
            args: Prisma.PlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          create: {
            args: Prisma.PlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          createMany: {
            args: Prisma.PlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          update: {
            args: Prisma.PlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          deleteMany: {
            args: Prisma.PlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          aggregate: {
            args: Prisma.PlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlan>
          }
          groupBy: {
            args: Prisma.PlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanCountArgs<ExtArgs>
            result: $Utils.Optional<PlanCountAggregateOutputType> | number
          }
        }
      }
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Promotion: {
        payload: Prisma.$PromotionPayload<ExtArgs>
        fields: Prisma.PromotionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PromotionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PromotionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          findFirst: {
            args: Prisma.PromotionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PromotionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          findMany: {
            args: Prisma.PromotionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>[]
          }
          create: {
            args: Prisma.PromotionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          createMany: {
            args: Prisma.PromotionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PromotionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          update: {
            args: Prisma.PromotionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          deleteMany: {
            args: Prisma.PromotionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PromotionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PromotionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          aggregate: {
            args: Prisma.PromotionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePromotion>
          }
          groupBy: {
            args: Prisma.PromotionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PromotionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PromotionCountArgs<ExtArgs>
            result: $Utils.Optional<PromotionCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      LandingPageImage: {
        payload: Prisma.$LandingPageImagePayload<ExtArgs>
        fields: Prisma.LandingPageImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LandingPageImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LandingPageImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload>
          }
          findFirst: {
            args: Prisma.LandingPageImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LandingPageImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload>
          }
          findMany: {
            args: Prisma.LandingPageImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload>[]
          }
          create: {
            args: Prisma.LandingPageImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload>
          }
          createMany: {
            args: Prisma.LandingPageImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LandingPageImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload>
          }
          update: {
            args: Prisma.LandingPageImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload>
          }
          deleteMany: {
            args: Prisma.LandingPageImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LandingPageImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LandingPageImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageImagePayload>
          }
          aggregate: {
            args: Prisma.LandingPageImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLandingPageImage>
          }
          groupBy: {
            args: Prisma.LandingPageImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<LandingPageImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.LandingPageImageCountArgs<ExtArgs>
            result: $Utils.Optional<LandingPageImageCountAggregateOutputType> | number
          }
        }
      }
      LandingPageConfig: {
        payload: Prisma.$LandingPageConfigPayload<ExtArgs>
        fields: Prisma.LandingPageConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LandingPageConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LandingPageConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload>
          }
          findFirst: {
            args: Prisma.LandingPageConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LandingPageConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload>
          }
          findMany: {
            args: Prisma.LandingPageConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload>[]
          }
          create: {
            args: Prisma.LandingPageConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload>
          }
          createMany: {
            args: Prisma.LandingPageConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LandingPageConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload>
          }
          update: {
            args: Prisma.LandingPageConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload>
          }
          deleteMany: {
            args: Prisma.LandingPageConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LandingPageConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LandingPageConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandingPageConfigPayload>
          }
          aggregate: {
            args: Prisma.LandingPageConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLandingPageConfig>
          }
          groupBy: {
            args: Prisma.LandingPageConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<LandingPageConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.LandingPageConfigCountArgs<ExtArgs>
            result: $Utils.Optional<LandingPageConfigCountAggregateOutputType> | number
          }
        }
      }
      Report: {
        payload: Prisma.$ReportPayload<ExtArgs>
        fields: Prisma.ReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findFirst: {
            args: Prisma.ReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findMany: {
            args: Prisma.ReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          create: {
            args: Prisma.ReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          createMany: {
            args: Prisma.ReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          update: {
            args: Prisma.ReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          deleteMany: {
            args: Prisma.ReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          aggregate: {
            args: Prisma.ReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReport>
          }
          groupBy: {
            args: Prisma.ReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportCountArgs<ExtArgs>
            result: $Utils.Optional<ReportCountAggregateOutputType> | number
          }
        }
      }
      ExpirationNotification: {
        payload: Prisma.$ExpirationNotificationPayload<ExtArgs>
        fields: Prisma.ExpirationNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExpirationNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExpirationNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload>
          }
          findFirst: {
            args: Prisma.ExpirationNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExpirationNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload>
          }
          findMany: {
            args: Prisma.ExpirationNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload>[]
          }
          create: {
            args: Prisma.ExpirationNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload>
          }
          createMany: {
            args: Prisma.ExpirationNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ExpirationNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload>
          }
          update: {
            args: Prisma.ExpirationNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload>
          }
          deleteMany: {
            args: Prisma.ExpirationNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExpirationNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExpirationNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpirationNotificationPayload>
          }
          aggregate: {
            args: Prisma.ExpirationNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExpirationNotification>
          }
          groupBy: {
            args: Prisma.ExpirationNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExpirationNotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExpirationNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<ExpirationNotificationCountAggregateOutputType> | number
          }
        }
      }
      SuperAdminAccess: {
        payload: Prisma.$SuperAdminAccessPayload<ExtArgs>
        fields: Prisma.SuperAdminAccessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuperAdminAccessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuperAdminAccessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload>
          }
          findFirst: {
            args: Prisma.SuperAdminAccessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuperAdminAccessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload>
          }
          findMany: {
            args: Prisma.SuperAdminAccessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload>[]
          }
          create: {
            args: Prisma.SuperAdminAccessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload>
          }
          createMany: {
            args: Prisma.SuperAdminAccessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SuperAdminAccessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload>
          }
          update: {
            args: Prisma.SuperAdminAccessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload>
          }
          deleteMany: {
            args: Prisma.SuperAdminAccessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SuperAdminAccessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SuperAdminAccessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminAccessPayload>
          }
          aggregate: {
            args: Prisma.SuperAdminAccessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSuperAdminAccess>
          }
          groupBy: {
            args: Prisma.SuperAdminAccessGroupByArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminAccessGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuperAdminAccessCountArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminAccessCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    plan?: PlanOmit
    tenant?: TenantOmit
    subscription?: SubscriptionOmit
    promotion?: PromotionOmit
    chatMessage?: ChatMessageOmit
    landingPageImage?: LandingPageImageOmit
    landingPageConfig?: LandingPageConfigOmit
    report?: ReportOmit
    expirationNotification?: ExpirationNotificationOmit
    superAdminAccess?: SuperAdminAccessOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PlanCountOutputType
   */

  export type PlanCountOutputType = {
    subscriptions: number
    tenants: number
  }

  export type PlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | PlanCountOutputTypeCountSubscriptionsArgs
    tenants?: boolean | PlanCountOutputTypeCountTenantsArgs
  }

  // Custom InputTypes
  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanCountOutputType
     */
    select?: PlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeCountTenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
  }


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    subscriptions: number
    chatMessages: number
    promotions: number
    expirationNotifications: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | TenantCountOutputTypeCountSubscriptionsArgs
    chatMessages?: boolean | TenantCountOutputTypeCountChatMessagesArgs
    promotions?: boolean | TenantCountOutputTypeCountPromotionsArgs
    expirationNotifications?: boolean | TenantCountOutputTypeCountExpirationNotificationsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountChatMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountPromotionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromotionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountExpirationNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpirationNotificationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Plan
   */

  export type AggregatePlan = {
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  export type PlanAvgAggregateOutputType = {
    price: Decimal | null
    maxBarbers: number | null
    maxServices: number | null
    maxServiceOptions: number | null
    maxBookingsPerMonth: number | null
    maxBarberShops: number | null
    maxStorageMB: number | null
    trialDays: number | null
  }

  export type PlanSumAggregateOutputType = {
    price: Decimal | null
    maxBarbers: number | null
    maxServices: number | null
    maxServiceOptions: number | null
    maxBookingsPerMonth: number | null
    maxBarberShops: number | null
    maxStorageMB: number | null
    trialDays: number | null
  }

  export type PlanMinAggregateOutputType = {
    id: string | null
    name: string | null
    price: Decimal | null
    period: string | null
    description: string | null
    status: boolean | null
    maxBarbers: number | null
    maxServices: number | null
    maxServiceOptions: number | null
    maxBookingsPerMonth: number | null
    maxBarberShops: number | null
    maxStorageMB: number | null
    hasAnalytics: boolean | null
    hasNotifications: boolean | null
    hasCustomDomain: boolean | null
    hasWhiteLabel: boolean | null
    hasAPI: boolean | null
    hasPrioritySupport: boolean | null
    trialDays: number | null
    requiresCard: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlanMaxAggregateOutputType = {
    id: string | null
    name: string | null
    price: Decimal | null
    period: string | null
    description: string | null
    status: boolean | null
    maxBarbers: number | null
    maxServices: number | null
    maxServiceOptions: number | null
    maxBookingsPerMonth: number | null
    maxBarberShops: number | null
    maxStorageMB: number | null
    hasAnalytics: boolean | null
    hasNotifications: boolean | null
    hasCustomDomain: boolean | null
    hasWhiteLabel: boolean | null
    hasAPI: boolean | null
    hasPrioritySupport: boolean | null
    trialDays: number | null
    requiresCard: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlanCountAggregateOutputType = {
    id: number
    name: number
    price: number
    period: number
    description: number
    status: number
    maxBarbers: number
    maxServices: number
    maxServiceOptions: number
    maxBookingsPerMonth: number
    maxBarberShops: number
    maxStorageMB: number
    hasAnalytics: number
    hasNotifications: number
    hasCustomDomain: number
    hasWhiteLabel: number
    hasAPI: number
    hasPrioritySupport: number
    features: number
    trialDays: number
    requiresCard: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PlanAvgAggregateInputType = {
    price?: true
    maxBarbers?: true
    maxServices?: true
    maxServiceOptions?: true
    maxBookingsPerMonth?: true
    maxBarberShops?: true
    maxStorageMB?: true
    trialDays?: true
  }

  export type PlanSumAggregateInputType = {
    price?: true
    maxBarbers?: true
    maxServices?: true
    maxServiceOptions?: true
    maxBookingsPerMonth?: true
    maxBarberShops?: true
    maxStorageMB?: true
    trialDays?: true
  }

  export type PlanMinAggregateInputType = {
    id?: true
    name?: true
    price?: true
    period?: true
    description?: true
    status?: true
    maxBarbers?: true
    maxServices?: true
    maxServiceOptions?: true
    maxBookingsPerMonth?: true
    maxBarberShops?: true
    maxStorageMB?: true
    hasAnalytics?: true
    hasNotifications?: true
    hasCustomDomain?: true
    hasWhiteLabel?: true
    hasAPI?: true
    hasPrioritySupport?: true
    trialDays?: true
    requiresCard?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlanMaxAggregateInputType = {
    id?: true
    name?: true
    price?: true
    period?: true
    description?: true
    status?: true
    maxBarbers?: true
    maxServices?: true
    maxServiceOptions?: true
    maxBookingsPerMonth?: true
    maxBarberShops?: true
    maxStorageMB?: true
    hasAnalytics?: true
    hasNotifications?: true
    hasCustomDomain?: true
    hasWhiteLabel?: true
    hasAPI?: true
    hasPrioritySupport?: true
    trialDays?: true
    requiresCard?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlanCountAggregateInputType = {
    id?: true
    name?: true
    price?: true
    period?: true
    description?: true
    status?: true
    maxBarbers?: true
    maxServices?: true
    maxServiceOptions?: true
    maxBookingsPerMonth?: true
    maxBarberShops?: true
    maxStorageMB?: true
    hasAnalytics?: true
    hasNotifications?: true
    hasCustomDomain?: true
    hasWhiteLabel?: true
    hasAPI?: true
    hasPrioritySupport?: true
    features?: true
    trialDays?: true
    requiresCard?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plan to aggregate.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plans
    **/
    _count?: true | PlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanMaxAggregateInputType
  }

  export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
        [P in keyof T & keyof AggregatePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlan[P]>
      : GetScalarType<T[P], AggregatePlan[P]>
  }




  export type PlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanWhereInput
    orderBy?: PlanOrderByWithAggregationInput | PlanOrderByWithAggregationInput[]
    by: PlanScalarFieldEnum[] | PlanScalarFieldEnum
    having?: PlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanCountAggregateInputType | true
    _avg?: PlanAvgAggregateInputType
    _sum?: PlanSumAggregateInputType
    _min?: PlanMinAggregateInputType
    _max?: PlanMaxAggregateInputType
  }

  export type PlanGroupByOutputType = {
    id: string
    name: string
    price: Decimal
    period: string
    description: string | null
    status: boolean
    maxBarbers: number
    maxServices: number
    maxServiceOptions: number
    maxBookingsPerMonth: number
    maxBarberShops: number
    maxStorageMB: number
    hasAnalytics: boolean
    hasNotifications: boolean
    hasCustomDomain: boolean
    hasWhiteLabel: boolean
    hasAPI: boolean
    hasPrioritySupport: boolean
    features: JsonValue | null
    trialDays: number
    requiresCard: boolean
    createdAt: Date
    updatedAt: Date
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  type GetPlanGroupByPayload<T extends PlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanGroupByOutputType[P]>
            : GetScalarType<T[P], PlanGroupByOutputType[P]>
        }
      >
    >


  export type PlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    period?: boolean
    description?: boolean
    status?: boolean
    maxBarbers?: boolean
    maxServices?: boolean
    maxServiceOptions?: boolean
    maxBookingsPerMonth?: boolean
    maxBarberShops?: boolean
    maxStorageMB?: boolean
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: boolean
    trialDays?: boolean
    requiresCard?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscriptions?: boolean | Plan$subscriptionsArgs<ExtArgs>
    tenants?: boolean | Plan$tenantsArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plan"]>



  export type PlanSelectScalar = {
    id?: boolean
    name?: boolean
    price?: boolean
    period?: boolean
    description?: boolean
    status?: boolean
    maxBarbers?: boolean
    maxServices?: boolean
    maxServiceOptions?: boolean
    maxBookingsPerMonth?: boolean
    maxBarberShops?: boolean
    maxStorageMB?: boolean
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: boolean
    trialDays?: boolean
    requiresCard?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "price" | "period" | "description" | "status" | "maxBarbers" | "maxServices" | "maxServiceOptions" | "maxBookingsPerMonth" | "maxBarberShops" | "maxStorageMB" | "hasAnalytics" | "hasNotifications" | "hasCustomDomain" | "hasWhiteLabel" | "hasAPI" | "hasPrioritySupport" | "features" | "trialDays" | "requiresCard" | "createdAt" | "updatedAt", ExtArgs["result"]["plan"]>
  export type PlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | Plan$subscriptionsArgs<ExtArgs>
    tenants?: boolean | Plan$tenantsArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Plan"
    objects: {
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
      tenants: Prisma.$TenantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      price: Prisma.Decimal
      period: string
      description: string | null
      status: boolean
      maxBarbers: number
      maxServices: number
      maxServiceOptions: number
      maxBookingsPerMonth: number
      maxBarberShops: number
      maxStorageMB: number
      hasAnalytics: boolean
      hasNotifications: boolean
      hasCustomDomain: boolean
      hasWhiteLabel: boolean
      hasAPI: boolean
      hasPrioritySupport: boolean
      features: Prisma.JsonValue | null
      trialDays: number
      requiresCard: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["plan"]>
    composites: {}
  }

  type PlanGetPayload<S extends boolean | null | undefined | PlanDefaultArgs> = $Result.GetResult<Prisma.$PlanPayload, S>

  type PlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlanCountAggregateInputType | true
    }

  export interface PlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Plan'], meta: { name: 'Plan' } }
    /**
     * Find zero or one Plan that matches the filter.
     * @param {PlanFindUniqueArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanFindUniqueArgs>(args: SelectSubset<T, PlanFindUniqueArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Plan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlanFindUniqueOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanFindFirstArgs>(args?: SelectSubset<T, PlanFindFirstArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plans
     * const plans = await prisma.plan.findMany()
     * 
     * // Get first 10 Plans
     * const plans = await prisma.plan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planWithIdOnly = await prisma.plan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlanFindManyArgs>(args?: SelectSubset<T, PlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Plan.
     * @param {PlanCreateArgs} args - Arguments to create a Plan.
     * @example
     * // Create one Plan
     * const Plan = await prisma.plan.create({
     *   data: {
     *     // ... data to create a Plan
     *   }
     * })
     * 
     */
    create<T extends PlanCreateArgs>(args: SelectSubset<T, PlanCreateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Plans.
     * @param {PlanCreateManyArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanCreateManyArgs>(args?: SelectSubset<T, PlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Plan.
     * @param {PlanDeleteArgs} args - Arguments to delete one Plan.
     * @example
     * // Delete one Plan
     * const Plan = await prisma.plan.delete({
     *   where: {
     *     // ... filter to delete one Plan
     *   }
     * })
     * 
     */
    delete<T extends PlanDeleteArgs>(args: SelectSubset<T, PlanDeleteArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Plan.
     * @param {PlanUpdateArgs} args - Arguments to update one Plan.
     * @example
     * // Update one Plan
     * const plan = await prisma.plan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanUpdateArgs>(args: SelectSubset<T, PlanUpdateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Plans.
     * @param {PlanDeleteManyArgs} args - Arguments to filter Plans to delete.
     * @example
     * // Delete a few Plans
     * const { count } = await prisma.plan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanDeleteManyArgs>(args?: SelectSubset<T, PlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plans
     * const plan = await prisma.plan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanUpdateManyArgs>(args: SelectSubset<T, PlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Plan.
     * @param {PlanUpsertArgs} args - Arguments to update or create a Plan.
     * @example
     * // Update or create a Plan
     * const plan = await prisma.plan.upsert({
     *   create: {
     *     // ... data to create a Plan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plan we want to update
     *   }
     * })
     */
    upsert<T extends PlanUpsertArgs>(args: SelectSubset<T, PlanUpsertArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanCountArgs} args - Arguments to filter Plans to count.
     * @example
     * // Count the number of Plans
     * const count = await prisma.plan.count({
     *   where: {
     *     // ... the filter for the Plans we want to count
     *   }
     * })
    **/
    count<T extends PlanCountArgs>(
      args?: Subset<T, PlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanAggregateArgs>(args: Subset<T, PlanAggregateArgs>): Prisma.PrismaPromise<GetPlanAggregateType<T>>

    /**
     * Group by Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanGroupByArgs['orderBy'] }
        : { orderBy?: PlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Plan model
   */
  readonly fields: PlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Plan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscriptions<T extends Plan$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Plan$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tenants<T extends Plan$tenantsArgs<ExtArgs> = {}>(args?: Subset<T, Plan$tenantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Plan model
   */
  interface PlanFieldRefs {
    readonly id: FieldRef<"Plan", 'String'>
    readonly name: FieldRef<"Plan", 'String'>
    readonly price: FieldRef<"Plan", 'Decimal'>
    readonly period: FieldRef<"Plan", 'String'>
    readonly description: FieldRef<"Plan", 'String'>
    readonly status: FieldRef<"Plan", 'Boolean'>
    readonly maxBarbers: FieldRef<"Plan", 'Int'>
    readonly maxServices: FieldRef<"Plan", 'Int'>
    readonly maxServiceOptions: FieldRef<"Plan", 'Int'>
    readonly maxBookingsPerMonth: FieldRef<"Plan", 'Int'>
    readonly maxBarberShops: FieldRef<"Plan", 'Int'>
    readonly maxStorageMB: FieldRef<"Plan", 'Int'>
    readonly hasAnalytics: FieldRef<"Plan", 'Boolean'>
    readonly hasNotifications: FieldRef<"Plan", 'Boolean'>
    readonly hasCustomDomain: FieldRef<"Plan", 'Boolean'>
    readonly hasWhiteLabel: FieldRef<"Plan", 'Boolean'>
    readonly hasAPI: FieldRef<"Plan", 'Boolean'>
    readonly hasPrioritySupport: FieldRef<"Plan", 'Boolean'>
    readonly features: FieldRef<"Plan", 'Json'>
    readonly trialDays: FieldRef<"Plan", 'Int'>
    readonly requiresCard: FieldRef<"Plan", 'Boolean'>
    readonly createdAt: FieldRef<"Plan", 'DateTime'>
    readonly updatedAt: FieldRef<"Plan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Plan findUnique
   */
  export type PlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findUniqueOrThrow
   */
  export type PlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findFirst
   */
  export type PlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findFirstOrThrow
   */
  export type PlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findMany
   */
  export type PlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plans to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan create
   */
  export type PlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to create a Plan.
     */
    data: XOR<PlanCreateInput, PlanUncheckedCreateInput>
  }

  /**
   * Plan createMany
   */
  export type PlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan update
   */
  export type PlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to update a Plan.
     */
    data: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
    /**
     * Choose, which Plan to update.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan updateMany
   */
  export type PlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plans.
     */
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>
    /**
     * Filter which Plans to update
     */
    where?: PlanWhereInput
    /**
     * Limit how many Plans to update.
     */
    limit?: number
  }

  /**
   * Plan upsert
   */
  export type PlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The filter to search for the Plan to update in case it exists.
     */
    where: PlanWhereUniqueInput
    /**
     * In case the Plan found by the `where` argument doesn't exist, create a new Plan with this data.
     */
    create: XOR<PlanCreateInput, PlanUncheckedCreateInput>
    /**
     * In case the Plan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
  }

  /**
   * Plan delete
   */
  export type PlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter which Plan to delete.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan deleteMany
   */
  export type PlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plans to delete
     */
    where?: PlanWhereInput
    /**
     * Limit how many Plans to delete.
     */
    limit?: number
  }

  /**
   * Plan.subscriptions
   */
  export type Plan$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Plan.tenants
   */
  export type Plan$tenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    cursor?: TenantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Plan without action
   */
  export type PlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
  }


  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    currentBarbers: number | null
    currentServices: number | null
    currentBookingsThisMonth: number | null
    currentBarberShops: number | null
    currentStorageMB: number | null
  }

  export type TenantSumAggregateOutputType = {
    currentBarbers: number | null
    currentServices: number | null
    currentBookingsThisMonth: number | null
    currentBarberShops: number | null
    currentStorageMB: number | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    subdomain: string | null
    customDomain: string | null
    ownerName: string | null
    ownerEmail: string | null
    ownerPhone: string | null
    databaseName: string | null
    databaseUrl: string | null
    status: string | null
    isActive: boolean | null
    planId: string | null
    trialStartDate: Date | null
    trialEndDate: Date | null
    trialUsed: boolean | null
    asaasCustomerId: string | null
    asaasSubscriptionId: string | null
    currentBarbers: number | null
    currentServices: number | null
    currentBookingsThisMonth: number | null
    currentBarberShops: number | null
    currentStorageMB: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    subdomain: string | null
    customDomain: string | null
    ownerName: string | null
    ownerEmail: string | null
    ownerPhone: string | null
    databaseName: string | null
    databaseUrl: string | null
    status: string | null
    isActive: boolean | null
    planId: string | null
    trialStartDate: Date | null
    trialEndDate: Date | null
    trialUsed: boolean | null
    asaasCustomerId: string | null
    asaasSubscriptionId: string | null
    currentBarbers: number | null
    currentServices: number | null
    currentBookingsThisMonth: number | null
    currentBarberShops: number | null
    currentStorageMB: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    subdomain: number
    customDomain: number
    ownerName: number
    ownerEmail: number
    ownerPhone: number
    databaseName: number
    databaseUrl: number
    status: number
    isActive: number
    planId: number
    trialStartDate: number
    trialEndDate: number
    trialUsed: number
    asaasCustomerId: number
    asaasSubscriptionId: number
    currentBarbers: number
    currentServices: number
    currentBookingsThisMonth: number
    currentBarberShops: number
    currentStorageMB: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantAvgAggregateInputType = {
    currentBarbers?: true
    currentServices?: true
    currentBookingsThisMonth?: true
    currentBarberShops?: true
    currentStorageMB?: true
  }

  export type TenantSumAggregateInputType = {
    currentBarbers?: true
    currentServices?: true
    currentBookingsThisMonth?: true
    currentBarberShops?: true
    currentStorageMB?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    customDomain?: true
    ownerName?: true
    ownerEmail?: true
    ownerPhone?: true
    databaseName?: true
    databaseUrl?: true
    status?: true
    isActive?: true
    planId?: true
    trialStartDate?: true
    trialEndDate?: true
    trialUsed?: true
    asaasCustomerId?: true
    asaasSubscriptionId?: true
    currentBarbers?: true
    currentServices?: true
    currentBookingsThisMonth?: true
    currentBarberShops?: true
    currentStorageMB?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    customDomain?: true
    ownerName?: true
    ownerEmail?: true
    ownerPhone?: true
    databaseName?: true
    databaseUrl?: true
    status?: true
    isActive?: true
    planId?: true
    trialStartDate?: true
    trialEndDate?: true
    trialUsed?: true
    asaasCustomerId?: true
    asaasSubscriptionId?: true
    currentBarbers?: true
    currentServices?: true
    currentBookingsThisMonth?: true
    currentBarberShops?: true
    currentStorageMB?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    subdomain?: true
    customDomain?: true
    ownerName?: true
    ownerEmail?: true
    ownerPhone?: true
    databaseName?: true
    databaseUrl?: true
    status?: true
    isActive?: true
    planId?: true
    trialStartDate?: true
    trialEndDate?: true
    trialUsed?: true
    asaasCustomerId?: true
    asaasSubscriptionId?: true
    currentBarbers?: true
    currentServices?: true
    currentBookingsThisMonth?: true
    currentBarberShops?: true
    currentStorageMB?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    name: string
    subdomain: string
    customDomain: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone: string | null
    databaseName: string
    databaseUrl: string
    status: string
    isActive: boolean
    planId: string | null
    trialStartDate: Date | null
    trialEndDate: Date | null
    trialUsed: boolean
    asaasCustomerId: string | null
    asaasSubscriptionId: string | null
    currentBarbers: number
    currentServices: number
    currentBookingsThisMonth: number
    currentBarberShops: number
    currentStorageMB: number
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    subdomain?: boolean
    customDomain?: boolean
    ownerName?: boolean
    ownerEmail?: boolean
    ownerPhone?: boolean
    databaseName?: boolean
    databaseUrl?: boolean
    status?: boolean
    isActive?: boolean
    planId?: boolean
    trialStartDate?: boolean
    trialEndDate?: boolean
    trialUsed?: boolean
    asaasCustomerId?: boolean
    asaasSubscriptionId?: boolean
    currentBarbers?: boolean
    currentServices?: boolean
    currentBookingsThisMonth?: boolean
    currentBarberShops?: boolean
    currentStorageMB?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    plan?: boolean | Tenant$planArgs<ExtArgs>
    subscriptions?: boolean | Tenant$subscriptionsArgs<ExtArgs>
    chatMessages?: boolean | Tenant$chatMessagesArgs<ExtArgs>
    promotions?: boolean | Tenant$promotionsArgs<ExtArgs>
    expirationNotifications?: boolean | Tenant$expirationNotificationsArgs<ExtArgs>
    superAdminAccess?: boolean | Tenant$superAdminAccessArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>



  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    subdomain?: boolean
    customDomain?: boolean
    ownerName?: boolean
    ownerEmail?: boolean
    ownerPhone?: boolean
    databaseName?: boolean
    databaseUrl?: boolean
    status?: boolean
    isActive?: boolean
    planId?: boolean
    trialStartDate?: boolean
    trialEndDate?: boolean
    trialUsed?: boolean
    asaasCustomerId?: boolean
    asaasSubscriptionId?: boolean
    currentBarbers?: boolean
    currentServices?: boolean
    currentBookingsThisMonth?: boolean
    currentBarberShops?: boolean
    currentStorageMB?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "subdomain" | "customDomain" | "ownerName" | "ownerEmail" | "ownerPhone" | "databaseName" | "databaseUrl" | "status" | "isActive" | "planId" | "trialStartDate" | "trialEndDate" | "trialUsed" | "asaasCustomerId" | "asaasSubscriptionId" | "currentBarbers" | "currentServices" | "currentBookingsThisMonth" | "currentBarberShops" | "currentStorageMB" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plan?: boolean | Tenant$planArgs<ExtArgs>
    subscriptions?: boolean | Tenant$subscriptionsArgs<ExtArgs>
    chatMessages?: boolean | Tenant$chatMessagesArgs<ExtArgs>
    promotions?: boolean | Tenant$promotionsArgs<ExtArgs>
    expirationNotifications?: boolean | Tenant$expirationNotificationsArgs<ExtArgs>
    superAdminAccess?: boolean | Tenant$superAdminAccessArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      plan: Prisma.$PlanPayload<ExtArgs> | null
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
      chatMessages: Prisma.$ChatMessagePayload<ExtArgs>[]
      promotions: Prisma.$PromotionPayload<ExtArgs>[]
      expirationNotifications: Prisma.$ExpirationNotificationPayload<ExtArgs>[]
      superAdminAccess: Prisma.$SuperAdminAccessPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      subdomain: string
      customDomain: string | null
      ownerName: string
      ownerEmail: string
      ownerPhone: string | null
      databaseName: string
      databaseUrl: string
      status: string
      isActive: boolean
      planId: string | null
      trialStartDate: Date | null
      trialEndDate: Date | null
      trialUsed: boolean
      asaasCustomerId: string | null
      asaasSubscriptionId: string | null
      currentBarbers: number
      currentServices: number
      currentBookingsThisMonth: number
      currentBarberShops: number
      currentStorageMB: number
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plan<T extends Tenant$planArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$planArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    subscriptions<T extends Tenant$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatMessages<T extends Tenant$chatMessagesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$chatMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    promotions<T extends Tenant$promotionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$promotionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    expirationNotifications<T extends Tenant$expirationNotificationsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$expirationNotificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    superAdminAccess<T extends Tenant$superAdminAccessArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$superAdminAccessArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly subdomain: FieldRef<"Tenant", 'String'>
    readonly customDomain: FieldRef<"Tenant", 'String'>
    readonly ownerName: FieldRef<"Tenant", 'String'>
    readonly ownerEmail: FieldRef<"Tenant", 'String'>
    readonly ownerPhone: FieldRef<"Tenant", 'String'>
    readonly databaseName: FieldRef<"Tenant", 'String'>
    readonly databaseUrl: FieldRef<"Tenant", 'String'>
    readonly status: FieldRef<"Tenant", 'String'>
    readonly isActive: FieldRef<"Tenant", 'Boolean'>
    readonly planId: FieldRef<"Tenant", 'String'>
    readonly trialStartDate: FieldRef<"Tenant", 'DateTime'>
    readonly trialEndDate: FieldRef<"Tenant", 'DateTime'>
    readonly trialUsed: FieldRef<"Tenant", 'Boolean'>
    readonly asaasCustomerId: FieldRef<"Tenant", 'String'>
    readonly asaasSubscriptionId: FieldRef<"Tenant", 'String'>
    readonly currentBarbers: FieldRef<"Tenant", 'Int'>
    readonly currentServices: FieldRef<"Tenant", 'Int'>
    readonly currentBookingsThisMonth: FieldRef<"Tenant", 'Int'>
    readonly currentBarberShops: FieldRef<"Tenant", 'Int'>
    readonly currentStorageMB: FieldRef<"Tenant", 'Int'>
    readonly metadata: FieldRef<"Tenant", 'Json'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.plan
   */
  export type Tenant$planArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    where?: PlanWhereInput
  }

  /**
   * Tenant.subscriptions
   */
  export type Tenant$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Tenant.chatMessages
   */
  export type Tenant$chatMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * Tenant.promotions
   */
  export type Tenant$promotionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    where?: PromotionWhereInput
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    cursor?: PromotionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PromotionScalarFieldEnum | PromotionScalarFieldEnum[]
  }

  /**
   * Tenant.expirationNotifications
   */
  export type Tenant$expirationNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    where?: ExpirationNotificationWhereInput
    orderBy?: ExpirationNotificationOrderByWithRelationInput | ExpirationNotificationOrderByWithRelationInput[]
    cursor?: ExpirationNotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExpirationNotificationScalarFieldEnum | ExpirationNotificationScalarFieldEnum[]
  }

  /**
   * Tenant.superAdminAccess
   */
  export type Tenant$superAdminAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    where?: SuperAdminAccessWhereInput
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _avg: SubscriptionAvgAggregateOutputType | null
    _sum: SubscriptionSumAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type SubscriptionSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planId: string | null
    status: string | null
    isActive: boolean | null
    startDate: Date | null
    endDate: Date | null
    cancelledAt: Date | null
    asaasSubscriptionId: string | null
    paymentMethod: string | null
    amount: Decimal | null
    autoRenew: boolean | null
    nextBillingDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planId: string | null
    status: string | null
    isActive: boolean | null
    startDate: Date | null
    endDate: Date | null
    cancelledAt: Date | null
    asaasSubscriptionId: string | null
    paymentMethod: string | null
    amount: Decimal | null
    autoRenew: boolean | null
    nextBillingDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    tenantId: number
    planId: number
    status: number
    isActive: number
    startDate: number
    endDate: number
    cancelledAt: number
    asaasSubscriptionId: number
    paymentMethod: number
    amount: number
    autoRenew: number
    nextBillingDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionAvgAggregateInputType = {
    amount?: true
  }

  export type SubscriptionSumAggregateInputType = {
    amount?: true
  }

  export type SubscriptionMinAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    isActive?: true
    startDate?: true
    endDate?: true
    cancelledAt?: true
    asaasSubscriptionId?: true
    paymentMethod?: true
    amount?: true
    autoRenew?: true
    nextBillingDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    isActive?: true
    startDate?: true
    endDate?: true
    cancelledAt?: true
    asaasSubscriptionId?: true
    paymentMethod?: true
    amount?: true
    autoRenew?: true
    nextBillingDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    isActive?: true
    startDate?: true
    endDate?: true
    cancelledAt?: true
    asaasSubscriptionId?: true
    paymentMethod?: true
    amount?: true
    autoRenew?: true
    nextBillingDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _avg?: SubscriptionAvgAggregateInputType
    _sum?: SubscriptionSumAggregateInputType
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    tenantId: string
    planId: string
    status: string
    isActive: boolean
    startDate: Date
    endDate: Date | null
    cancelledAt: Date | null
    asaasSubscriptionId: string | null
    paymentMethod: string | null
    amount: Decimal | null
    autoRenew: boolean
    nextBillingDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _avg: SubscriptionAvgAggregateOutputType | null
    _sum: SubscriptionSumAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    isActive?: boolean
    startDate?: boolean
    endDate?: boolean
    cancelledAt?: boolean
    asaasSubscriptionId?: boolean
    paymentMethod?: boolean
    amount?: boolean
    autoRenew?: boolean
    nextBillingDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | PlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>



  export type SubscriptionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    isActive?: boolean
    startDate?: boolean
    endDate?: boolean
    cancelledAt?: boolean
    asaasSubscriptionId?: boolean
    paymentMethod?: boolean
    amount?: boolean
    autoRenew?: boolean
    nextBillingDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "planId" | "status" | "isActive" | "startDate" | "endDate" | "cancelledAt" | "asaasSubscriptionId" | "paymentMethod" | "amount" | "autoRenew" | "nextBillingDate" | "createdAt" | "updatedAt", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | PlanDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      plan: Prisma.$PlanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      planId: string
      status: string
      isActive: boolean
      startDate: Date
      endDate: Date | null
      cancelledAt: Date | null
      asaasSubscriptionId: string | null
      paymentMethod: string | null
      amount: Prisma.Decimal | null
      autoRenew: boolean
      nextBillingDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plan<T extends PlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanDefaultArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly tenantId: FieldRef<"Subscription", 'String'>
    readonly planId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly isActive: FieldRef<"Subscription", 'Boolean'>
    readonly startDate: FieldRef<"Subscription", 'DateTime'>
    readonly endDate: FieldRef<"Subscription", 'DateTime'>
    readonly cancelledAt: FieldRef<"Subscription", 'DateTime'>
    readonly asaasSubscriptionId: FieldRef<"Subscription", 'String'>
    readonly paymentMethod: FieldRef<"Subscription", 'String'>
    readonly amount: FieldRef<"Subscription", 'Decimal'>
    readonly autoRenew: FieldRef<"Subscription", 'Boolean'>
    readonly nextBillingDate: FieldRef<"Subscription", 'DateTime'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
    readonly updatedAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Promotion
   */

  export type AggregatePromotion = {
    _count: PromotionCountAggregateOutputType | null
    _avg: PromotionAvgAggregateOutputType | null
    _sum: PromotionSumAggregateOutputType | null
    _min: PromotionMinAggregateOutputType | null
    _max: PromotionMaxAggregateOutputType | null
  }

  export type PromotionAvgAggregateOutputType = {
    discountValue: Decimal | null
    maxUses: number | null
    currentUses: number | null
  }

  export type PromotionSumAggregateOutputType = {
    discountValue: Decimal | null
    maxUses: number | null
    currentUses: number | null
  }

  export type PromotionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    description: string | null
    code: string | null
    discountType: string | null
    discountValue: Decimal | null
    maxUses: number | null
    currentUses: number | null
    validFrom: Date | null
    validUntil: Date | null
    status: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PromotionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    description: string | null
    code: string | null
    discountType: string | null
    discountValue: Decimal | null
    maxUses: number | null
    currentUses: number | null
    validFrom: Date | null
    validUntil: Date | null
    status: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PromotionCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    description: number
    code: number
    discountType: number
    discountValue: number
    maxUses: number
    currentUses: number
    validFrom: number
    validUntil: number
    planIds: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PromotionAvgAggregateInputType = {
    discountValue?: true
    maxUses?: true
    currentUses?: true
  }

  export type PromotionSumAggregateInputType = {
    discountValue?: true
    maxUses?: true
    currentUses?: true
  }

  export type PromotionMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    description?: true
    code?: true
    discountType?: true
    discountValue?: true
    maxUses?: true
    currentUses?: true
    validFrom?: true
    validUntil?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PromotionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    description?: true
    code?: true
    discountType?: true
    discountValue?: true
    maxUses?: true
    currentUses?: true
    validFrom?: true
    validUntil?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PromotionCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    description?: true
    code?: true
    discountType?: true
    discountValue?: true
    maxUses?: true
    currentUses?: true
    validFrom?: true
    validUntil?: true
    planIds?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PromotionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Promotion to aggregate.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Promotions
    **/
    _count?: true | PromotionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PromotionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PromotionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PromotionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PromotionMaxAggregateInputType
  }

  export type GetPromotionAggregateType<T extends PromotionAggregateArgs> = {
        [P in keyof T & keyof AggregatePromotion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePromotion[P]>
      : GetScalarType<T[P], AggregatePromotion[P]>
  }




  export type PromotionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromotionWhereInput
    orderBy?: PromotionOrderByWithAggregationInput | PromotionOrderByWithAggregationInput[]
    by: PromotionScalarFieldEnum[] | PromotionScalarFieldEnum
    having?: PromotionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PromotionCountAggregateInputType | true
    _avg?: PromotionAvgAggregateInputType
    _sum?: PromotionSumAggregateInputType
    _min?: PromotionMinAggregateInputType
    _max?: PromotionMaxAggregateInputType
  }

  export type PromotionGroupByOutputType = {
    id: string
    tenantId: string | null
    name: string
    description: string | null
    code: string
    discountType: string
    discountValue: Decimal
    maxUses: number | null
    currentUses: number
    validFrom: Date
    validUntil: Date | null
    planIds: JsonValue | null
    status: boolean
    createdAt: Date
    updatedAt: Date
    _count: PromotionCountAggregateOutputType | null
    _avg: PromotionAvgAggregateOutputType | null
    _sum: PromotionSumAggregateOutputType | null
    _min: PromotionMinAggregateOutputType | null
    _max: PromotionMaxAggregateOutputType | null
  }

  type GetPromotionGroupByPayload<T extends PromotionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PromotionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PromotionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PromotionGroupByOutputType[P]>
            : GetScalarType<T[P], PromotionGroupByOutputType[P]>
        }
      >
    >


  export type PromotionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    description?: boolean
    code?: boolean
    discountType?: boolean
    discountValue?: boolean
    maxUses?: boolean
    currentUses?: boolean
    validFrom?: boolean
    validUntil?: boolean
    planIds?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | Promotion$tenantArgs<ExtArgs>
  }, ExtArgs["result"]["promotion"]>



  export type PromotionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    description?: boolean
    code?: boolean
    discountType?: boolean
    discountValue?: boolean
    maxUses?: boolean
    currentUses?: boolean
    validFrom?: boolean
    validUntil?: boolean
    planIds?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PromotionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "description" | "code" | "discountType" | "discountValue" | "maxUses" | "currentUses" | "validFrom" | "validUntil" | "planIds" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["promotion"]>
  export type PromotionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | Promotion$tenantArgs<ExtArgs>
  }

  export type $PromotionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Promotion"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string | null
      name: string
      description: string | null
      code: string
      discountType: string
      discountValue: Prisma.Decimal
      maxUses: number | null
      currentUses: number
      validFrom: Date
      validUntil: Date | null
      planIds: Prisma.JsonValue | null
      status: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["promotion"]>
    composites: {}
  }

  type PromotionGetPayload<S extends boolean | null | undefined | PromotionDefaultArgs> = $Result.GetResult<Prisma.$PromotionPayload, S>

  type PromotionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PromotionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PromotionCountAggregateInputType | true
    }

  export interface PromotionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Promotion'], meta: { name: 'Promotion' } }
    /**
     * Find zero or one Promotion that matches the filter.
     * @param {PromotionFindUniqueArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromotionFindUniqueArgs>(args: SelectSubset<T, PromotionFindUniqueArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Promotion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PromotionFindUniqueOrThrowArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromotionFindUniqueOrThrowArgs>(args: SelectSubset<T, PromotionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Promotion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindFirstArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromotionFindFirstArgs>(args?: SelectSubset<T, PromotionFindFirstArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Promotion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindFirstOrThrowArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromotionFindFirstOrThrowArgs>(args?: SelectSubset<T, PromotionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Promotions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Promotions
     * const promotions = await prisma.promotion.findMany()
     * 
     * // Get first 10 Promotions
     * const promotions = await prisma.promotion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const promotionWithIdOnly = await prisma.promotion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PromotionFindManyArgs>(args?: SelectSubset<T, PromotionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Promotion.
     * @param {PromotionCreateArgs} args - Arguments to create a Promotion.
     * @example
     * // Create one Promotion
     * const Promotion = await prisma.promotion.create({
     *   data: {
     *     // ... data to create a Promotion
     *   }
     * })
     * 
     */
    create<T extends PromotionCreateArgs>(args: SelectSubset<T, PromotionCreateArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Promotions.
     * @param {PromotionCreateManyArgs} args - Arguments to create many Promotions.
     * @example
     * // Create many Promotions
     * const promotion = await prisma.promotion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PromotionCreateManyArgs>(args?: SelectSubset<T, PromotionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Promotion.
     * @param {PromotionDeleteArgs} args - Arguments to delete one Promotion.
     * @example
     * // Delete one Promotion
     * const Promotion = await prisma.promotion.delete({
     *   where: {
     *     // ... filter to delete one Promotion
     *   }
     * })
     * 
     */
    delete<T extends PromotionDeleteArgs>(args: SelectSubset<T, PromotionDeleteArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Promotion.
     * @param {PromotionUpdateArgs} args - Arguments to update one Promotion.
     * @example
     * // Update one Promotion
     * const promotion = await prisma.promotion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PromotionUpdateArgs>(args: SelectSubset<T, PromotionUpdateArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Promotions.
     * @param {PromotionDeleteManyArgs} args - Arguments to filter Promotions to delete.
     * @example
     * // Delete a few Promotions
     * const { count } = await prisma.promotion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PromotionDeleteManyArgs>(args?: SelectSubset<T, PromotionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Promotions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Promotions
     * const promotion = await prisma.promotion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PromotionUpdateManyArgs>(args: SelectSubset<T, PromotionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Promotion.
     * @param {PromotionUpsertArgs} args - Arguments to update or create a Promotion.
     * @example
     * // Update or create a Promotion
     * const promotion = await prisma.promotion.upsert({
     *   create: {
     *     // ... data to create a Promotion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Promotion we want to update
     *   }
     * })
     */
    upsert<T extends PromotionUpsertArgs>(args: SelectSubset<T, PromotionUpsertArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Promotions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionCountArgs} args - Arguments to filter Promotions to count.
     * @example
     * // Count the number of Promotions
     * const count = await prisma.promotion.count({
     *   where: {
     *     // ... the filter for the Promotions we want to count
     *   }
     * })
    **/
    count<T extends PromotionCountArgs>(
      args?: Subset<T, PromotionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromotionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Promotion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PromotionAggregateArgs>(args: Subset<T, PromotionAggregateArgs>): Prisma.PrismaPromise<GetPromotionAggregateType<T>>

    /**
     * Group by Promotion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PromotionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromotionGroupByArgs['orderBy'] }
        : { orderBy?: PromotionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PromotionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Promotion model
   */
  readonly fields: PromotionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Promotion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PromotionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends Promotion$tenantArgs<ExtArgs> = {}>(args?: Subset<T, Promotion$tenantArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Promotion model
   */
  interface PromotionFieldRefs {
    readonly id: FieldRef<"Promotion", 'String'>
    readonly tenantId: FieldRef<"Promotion", 'String'>
    readonly name: FieldRef<"Promotion", 'String'>
    readonly description: FieldRef<"Promotion", 'String'>
    readonly code: FieldRef<"Promotion", 'String'>
    readonly discountType: FieldRef<"Promotion", 'String'>
    readonly discountValue: FieldRef<"Promotion", 'Decimal'>
    readonly maxUses: FieldRef<"Promotion", 'Int'>
    readonly currentUses: FieldRef<"Promotion", 'Int'>
    readonly validFrom: FieldRef<"Promotion", 'DateTime'>
    readonly validUntil: FieldRef<"Promotion", 'DateTime'>
    readonly planIds: FieldRef<"Promotion", 'Json'>
    readonly status: FieldRef<"Promotion", 'Boolean'>
    readonly createdAt: FieldRef<"Promotion", 'DateTime'>
    readonly updatedAt: FieldRef<"Promotion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Promotion findUnique
   */
  export type PromotionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotion to fetch.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion findUniqueOrThrow
   */
  export type PromotionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotion to fetch.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion findFirst
   */
  export type PromotionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotion to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Promotions.
     */
    distinct?: PromotionScalarFieldEnum | PromotionScalarFieldEnum[]
  }

  /**
   * Promotion findFirstOrThrow
   */
  export type PromotionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotion to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Promotions.
     */
    distinct?: PromotionScalarFieldEnum | PromotionScalarFieldEnum[]
  }

  /**
   * Promotion findMany
   */
  export type PromotionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotions to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    distinct?: PromotionScalarFieldEnum | PromotionScalarFieldEnum[]
  }

  /**
   * Promotion create
   */
  export type PromotionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * The data needed to create a Promotion.
     */
    data: XOR<PromotionCreateInput, PromotionUncheckedCreateInput>
  }

  /**
   * Promotion createMany
   */
  export type PromotionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Promotions.
     */
    data: PromotionCreateManyInput | PromotionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Promotion update
   */
  export type PromotionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * The data needed to update a Promotion.
     */
    data: XOR<PromotionUpdateInput, PromotionUncheckedUpdateInput>
    /**
     * Choose, which Promotion to update.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion updateMany
   */
  export type PromotionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Promotions.
     */
    data: XOR<PromotionUpdateManyMutationInput, PromotionUncheckedUpdateManyInput>
    /**
     * Filter which Promotions to update
     */
    where?: PromotionWhereInput
    /**
     * Limit how many Promotions to update.
     */
    limit?: number
  }

  /**
   * Promotion upsert
   */
  export type PromotionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * The filter to search for the Promotion to update in case it exists.
     */
    where: PromotionWhereUniqueInput
    /**
     * In case the Promotion found by the `where` argument doesn't exist, create a new Promotion with this data.
     */
    create: XOR<PromotionCreateInput, PromotionUncheckedCreateInput>
    /**
     * In case the Promotion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromotionUpdateInput, PromotionUncheckedUpdateInput>
  }

  /**
   * Promotion delete
   */
  export type PromotionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter which Promotion to delete.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion deleteMany
   */
  export type PromotionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Promotions to delete
     */
    where?: PromotionWhereInput
    /**
     * Limit how many Promotions to delete.
     */
    limit?: number
  }

  /**
   * Promotion.tenant
   */
  export type Promotion$tenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    where?: TenantWhereInput
  }

  /**
   * Promotion without action
   */
  export type PromotionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Promotion
     */
    omit?: PromotionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    senderId: string | null
    senderName: string | null
    senderType: string | null
    message: string | null
    isRead: boolean | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    senderId: string | null
    senderName: string | null
    senderType: string | null
    message: string | null
    isRead: boolean | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    tenantId: number
    senderId: number
    senderName: number
    senderType: number
    message: number
    isRead: number
    readAt: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    tenantId?: true
    senderId?: true
    senderName?: true
    senderType?: true
    message?: true
    isRead?: true
    readAt?: true
    createdAt?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    tenantId?: true
    senderId?: true
    senderName?: true
    senderType?: true
    message?: true
    isRead?: true
    readAt?: true
    createdAt?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    tenantId?: true
    senderId?: true
    senderName?: true
    senderType?: true
    message?: true
    isRead?: true
    readAt?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    tenantId: string | null
    senderId: string
    senderName: string
    senderType: string
    message: string
    isRead: boolean
    readAt: Date | null
    metadata: JsonValue | null
    createdAt: Date
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    senderId?: boolean
    senderName?: boolean
    senderType?: boolean
    message?: boolean
    isRead?: boolean
    readAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    tenant?: boolean | ChatMessage$tenantArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>



  export type ChatMessageSelectScalar = {
    id?: boolean
    tenantId?: boolean
    senderId?: boolean
    senderName?: boolean
    senderType?: boolean
    message?: boolean
    isRead?: boolean
    readAt?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "senderId" | "senderName" | "senderType" | "message" | "isRead" | "readAt" | "metadata" | "createdAt", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | ChatMessage$tenantArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string | null
      senderId: string
      senderName: string
      senderType: string
      message: string
      isRead: boolean
      readAt: Date | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends ChatMessage$tenantArgs<ExtArgs> = {}>(args?: Subset<T, ChatMessage$tenantArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly tenantId: FieldRef<"ChatMessage", 'String'>
    readonly senderId: FieldRef<"ChatMessage", 'String'>
    readonly senderName: FieldRef<"ChatMessage", 'String'>
    readonly senderType: FieldRef<"ChatMessage", 'String'>
    readonly message: FieldRef<"ChatMessage", 'String'>
    readonly isRead: FieldRef<"ChatMessage", 'Boolean'>
    readonly readAt: FieldRef<"ChatMessage", 'DateTime'>
    readonly metadata: FieldRef<"ChatMessage", 'Json'>
    readonly createdAt: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage.tenant
   */
  export type ChatMessage$tenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    where?: TenantWhereInput
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model LandingPageImage
   */

  export type AggregateLandingPageImage = {
    _count: LandingPageImageCountAggregateOutputType | null
    _avg: LandingPageImageAvgAggregateOutputType | null
    _sum: LandingPageImageSumAggregateOutputType | null
    _min: LandingPageImageMinAggregateOutputType | null
    _max: LandingPageImageMaxAggregateOutputType | null
  }

  export type LandingPageImageAvgAggregateOutputType = {
    order: number | null
  }

  export type LandingPageImageSumAggregateOutputType = {
    order: number | null
  }

  export type LandingPageImageMinAggregateOutputType = {
    id: string | null
    section: string | null
    position: string | null
    imageUrl: string | null
    altText: string | null
    order: number | null
    status: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LandingPageImageMaxAggregateOutputType = {
    id: string | null
    section: string | null
    position: string | null
    imageUrl: string | null
    altText: string | null
    order: number | null
    status: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LandingPageImageCountAggregateOutputType = {
    id: number
    section: number
    position: number
    imageUrl: number
    altText: number
    order: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LandingPageImageAvgAggregateInputType = {
    order?: true
  }

  export type LandingPageImageSumAggregateInputType = {
    order?: true
  }

  export type LandingPageImageMinAggregateInputType = {
    id?: true
    section?: true
    position?: true
    imageUrl?: true
    altText?: true
    order?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LandingPageImageMaxAggregateInputType = {
    id?: true
    section?: true
    position?: true
    imageUrl?: true
    altText?: true
    order?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LandingPageImageCountAggregateInputType = {
    id?: true
    section?: true
    position?: true
    imageUrl?: true
    altText?: true
    order?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LandingPageImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandingPageImage to aggregate.
     */
    where?: LandingPageImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandingPageImages to fetch.
     */
    orderBy?: LandingPageImageOrderByWithRelationInput | LandingPageImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LandingPageImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandingPageImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandingPageImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LandingPageImages
    **/
    _count?: true | LandingPageImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LandingPageImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LandingPageImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LandingPageImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LandingPageImageMaxAggregateInputType
  }

  export type GetLandingPageImageAggregateType<T extends LandingPageImageAggregateArgs> = {
        [P in keyof T & keyof AggregateLandingPageImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLandingPageImage[P]>
      : GetScalarType<T[P], AggregateLandingPageImage[P]>
  }




  export type LandingPageImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LandingPageImageWhereInput
    orderBy?: LandingPageImageOrderByWithAggregationInput | LandingPageImageOrderByWithAggregationInput[]
    by: LandingPageImageScalarFieldEnum[] | LandingPageImageScalarFieldEnum
    having?: LandingPageImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LandingPageImageCountAggregateInputType | true
    _avg?: LandingPageImageAvgAggregateInputType
    _sum?: LandingPageImageSumAggregateInputType
    _min?: LandingPageImageMinAggregateInputType
    _max?: LandingPageImageMaxAggregateInputType
  }

  export type LandingPageImageGroupByOutputType = {
    id: string
    section: string
    position: string
    imageUrl: string
    altText: string | null
    order: number
    status: boolean
    createdAt: Date
    updatedAt: Date
    _count: LandingPageImageCountAggregateOutputType | null
    _avg: LandingPageImageAvgAggregateOutputType | null
    _sum: LandingPageImageSumAggregateOutputType | null
    _min: LandingPageImageMinAggregateOutputType | null
    _max: LandingPageImageMaxAggregateOutputType | null
  }

  type GetLandingPageImageGroupByPayload<T extends LandingPageImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LandingPageImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LandingPageImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LandingPageImageGroupByOutputType[P]>
            : GetScalarType<T[P], LandingPageImageGroupByOutputType[P]>
        }
      >
    >


  export type LandingPageImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    section?: boolean
    position?: boolean
    imageUrl?: boolean
    altText?: boolean
    order?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["landingPageImage"]>



  export type LandingPageImageSelectScalar = {
    id?: boolean
    section?: boolean
    position?: boolean
    imageUrl?: boolean
    altText?: boolean
    order?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LandingPageImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "section" | "position" | "imageUrl" | "altText" | "order" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["landingPageImage"]>

  export type $LandingPageImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LandingPageImage"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      section: string
      position: string
      imageUrl: string
      altText: string | null
      order: number
      status: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["landingPageImage"]>
    composites: {}
  }

  type LandingPageImageGetPayload<S extends boolean | null | undefined | LandingPageImageDefaultArgs> = $Result.GetResult<Prisma.$LandingPageImagePayload, S>

  type LandingPageImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LandingPageImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LandingPageImageCountAggregateInputType | true
    }

  export interface LandingPageImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LandingPageImage'], meta: { name: 'LandingPageImage' } }
    /**
     * Find zero or one LandingPageImage that matches the filter.
     * @param {LandingPageImageFindUniqueArgs} args - Arguments to find a LandingPageImage
     * @example
     * // Get one LandingPageImage
     * const landingPageImage = await prisma.landingPageImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LandingPageImageFindUniqueArgs>(args: SelectSubset<T, LandingPageImageFindUniqueArgs<ExtArgs>>): Prisma__LandingPageImageClient<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LandingPageImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LandingPageImageFindUniqueOrThrowArgs} args - Arguments to find a LandingPageImage
     * @example
     * // Get one LandingPageImage
     * const landingPageImage = await prisma.landingPageImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LandingPageImageFindUniqueOrThrowArgs>(args: SelectSubset<T, LandingPageImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LandingPageImageClient<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandingPageImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageImageFindFirstArgs} args - Arguments to find a LandingPageImage
     * @example
     * // Get one LandingPageImage
     * const landingPageImage = await prisma.landingPageImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LandingPageImageFindFirstArgs>(args?: SelectSubset<T, LandingPageImageFindFirstArgs<ExtArgs>>): Prisma__LandingPageImageClient<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandingPageImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageImageFindFirstOrThrowArgs} args - Arguments to find a LandingPageImage
     * @example
     * // Get one LandingPageImage
     * const landingPageImage = await prisma.landingPageImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LandingPageImageFindFirstOrThrowArgs>(args?: SelectSubset<T, LandingPageImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__LandingPageImageClient<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LandingPageImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LandingPageImages
     * const landingPageImages = await prisma.landingPageImage.findMany()
     * 
     * // Get first 10 LandingPageImages
     * const landingPageImages = await prisma.landingPageImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const landingPageImageWithIdOnly = await prisma.landingPageImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LandingPageImageFindManyArgs>(args?: SelectSubset<T, LandingPageImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LandingPageImage.
     * @param {LandingPageImageCreateArgs} args - Arguments to create a LandingPageImage.
     * @example
     * // Create one LandingPageImage
     * const LandingPageImage = await prisma.landingPageImage.create({
     *   data: {
     *     // ... data to create a LandingPageImage
     *   }
     * })
     * 
     */
    create<T extends LandingPageImageCreateArgs>(args: SelectSubset<T, LandingPageImageCreateArgs<ExtArgs>>): Prisma__LandingPageImageClient<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LandingPageImages.
     * @param {LandingPageImageCreateManyArgs} args - Arguments to create many LandingPageImages.
     * @example
     * // Create many LandingPageImages
     * const landingPageImage = await prisma.landingPageImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LandingPageImageCreateManyArgs>(args?: SelectSubset<T, LandingPageImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LandingPageImage.
     * @param {LandingPageImageDeleteArgs} args - Arguments to delete one LandingPageImage.
     * @example
     * // Delete one LandingPageImage
     * const LandingPageImage = await prisma.landingPageImage.delete({
     *   where: {
     *     // ... filter to delete one LandingPageImage
     *   }
     * })
     * 
     */
    delete<T extends LandingPageImageDeleteArgs>(args: SelectSubset<T, LandingPageImageDeleteArgs<ExtArgs>>): Prisma__LandingPageImageClient<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LandingPageImage.
     * @param {LandingPageImageUpdateArgs} args - Arguments to update one LandingPageImage.
     * @example
     * // Update one LandingPageImage
     * const landingPageImage = await prisma.landingPageImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LandingPageImageUpdateArgs>(args: SelectSubset<T, LandingPageImageUpdateArgs<ExtArgs>>): Prisma__LandingPageImageClient<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LandingPageImages.
     * @param {LandingPageImageDeleteManyArgs} args - Arguments to filter LandingPageImages to delete.
     * @example
     * // Delete a few LandingPageImages
     * const { count } = await prisma.landingPageImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LandingPageImageDeleteManyArgs>(args?: SelectSubset<T, LandingPageImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LandingPageImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LandingPageImages
     * const landingPageImage = await prisma.landingPageImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LandingPageImageUpdateManyArgs>(args: SelectSubset<T, LandingPageImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LandingPageImage.
     * @param {LandingPageImageUpsertArgs} args - Arguments to update or create a LandingPageImage.
     * @example
     * // Update or create a LandingPageImage
     * const landingPageImage = await prisma.landingPageImage.upsert({
     *   create: {
     *     // ... data to create a LandingPageImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LandingPageImage we want to update
     *   }
     * })
     */
    upsert<T extends LandingPageImageUpsertArgs>(args: SelectSubset<T, LandingPageImageUpsertArgs<ExtArgs>>): Prisma__LandingPageImageClient<$Result.GetResult<Prisma.$LandingPageImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LandingPageImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageImageCountArgs} args - Arguments to filter LandingPageImages to count.
     * @example
     * // Count the number of LandingPageImages
     * const count = await prisma.landingPageImage.count({
     *   where: {
     *     // ... the filter for the LandingPageImages we want to count
     *   }
     * })
    **/
    count<T extends LandingPageImageCountArgs>(
      args?: Subset<T, LandingPageImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LandingPageImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LandingPageImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LandingPageImageAggregateArgs>(args: Subset<T, LandingPageImageAggregateArgs>): Prisma.PrismaPromise<GetLandingPageImageAggregateType<T>>

    /**
     * Group by LandingPageImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LandingPageImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LandingPageImageGroupByArgs['orderBy'] }
        : { orderBy?: LandingPageImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LandingPageImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLandingPageImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LandingPageImage model
   */
  readonly fields: LandingPageImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LandingPageImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LandingPageImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LandingPageImage model
   */
  interface LandingPageImageFieldRefs {
    readonly id: FieldRef<"LandingPageImage", 'String'>
    readonly section: FieldRef<"LandingPageImage", 'String'>
    readonly position: FieldRef<"LandingPageImage", 'String'>
    readonly imageUrl: FieldRef<"LandingPageImage", 'String'>
    readonly altText: FieldRef<"LandingPageImage", 'String'>
    readonly order: FieldRef<"LandingPageImage", 'Int'>
    readonly status: FieldRef<"LandingPageImage", 'Boolean'>
    readonly createdAt: FieldRef<"LandingPageImage", 'DateTime'>
    readonly updatedAt: FieldRef<"LandingPageImage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LandingPageImage findUnique
   */
  export type LandingPageImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageImage to fetch.
     */
    where: LandingPageImageWhereUniqueInput
  }

  /**
   * LandingPageImage findUniqueOrThrow
   */
  export type LandingPageImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageImage to fetch.
     */
    where: LandingPageImageWhereUniqueInput
  }

  /**
   * LandingPageImage findFirst
   */
  export type LandingPageImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageImage to fetch.
     */
    where?: LandingPageImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandingPageImages to fetch.
     */
    orderBy?: LandingPageImageOrderByWithRelationInput | LandingPageImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandingPageImages.
     */
    cursor?: LandingPageImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandingPageImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandingPageImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandingPageImages.
     */
    distinct?: LandingPageImageScalarFieldEnum | LandingPageImageScalarFieldEnum[]
  }

  /**
   * LandingPageImage findFirstOrThrow
   */
  export type LandingPageImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageImage to fetch.
     */
    where?: LandingPageImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandingPageImages to fetch.
     */
    orderBy?: LandingPageImageOrderByWithRelationInput | LandingPageImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandingPageImages.
     */
    cursor?: LandingPageImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandingPageImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandingPageImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandingPageImages.
     */
    distinct?: LandingPageImageScalarFieldEnum | LandingPageImageScalarFieldEnum[]
  }

  /**
   * LandingPageImage findMany
   */
  export type LandingPageImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageImages to fetch.
     */
    where?: LandingPageImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandingPageImages to fetch.
     */
    orderBy?: LandingPageImageOrderByWithRelationInput | LandingPageImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LandingPageImages.
     */
    cursor?: LandingPageImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandingPageImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandingPageImages.
     */
    skip?: number
    distinct?: LandingPageImageScalarFieldEnum | LandingPageImageScalarFieldEnum[]
  }

  /**
   * LandingPageImage create
   */
  export type LandingPageImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * The data needed to create a LandingPageImage.
     */
    data: XOR<LandingPageImageCreateInput, LandingPageImageUncheckedCreateInput>
  }

  /**
   * LandingPageImage createMany
   */
  export type LandingPageImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LandingPageImages.
     */
    data: LandingPageImageCreateManyInput | LandingPageImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LandingPageImage update
   */
  export type LandingPageImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * The data needed to update a LandingPageImage.
     */
    data: XOR<LandingPageImageUpdateInput, LandingPageImageUncheckedUpdateInput>
    /**
     * Choose, which LandingPageImage to update.
     */
    where: LandingPageImageWhereUniqueInput
  }

  /**
   * LandingPageImage updateMany
   */
  export type LandingPageImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LandingPageImages.
     */
    data: XOR<LandingPageImageUpdateManyMutationInput, LandingPageImageUncheckedUpdateManyInput>
    /**
     * Filter which LandingPageImages to update
     */
    where?: LandingPageImageWhereInput
    /**
     * Limit how many LandingPageImages to update.
     */
    limit?: number
  }

  /**
   * LandingPageImage upsert
   */
  export type LandingPageImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * The filter to search for the LandingPageImage to update in case it exists.
     */
    where: LandingPageImageWhereUniqueInput
    /**
     * In case the LandingPageImage found by the `where` argument doesn't exist, create a new LandingPageImage with this data.
     */
    create: XOR<LandingPageImageCreateInput, LandingPageImageUncheckedCreateInput>
    /**
     * In case the LandingPageImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LandingPageImageUpdateInput, LandingPageImageUncheckedUpdateInput>
  }

  /**
   * LandingPageImage delete
   */
  export type LandingPageImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
    /**
     * Filter which LandingPageImage to delete.
     */
    where: LandingPageImageWhereUniqueInput
  }

  /**
   * LandingPageImage deleteMany
   */
  export type LandingPageImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandingPageImages to delete
     */
    where?: LandingPageImageWhereInput
    /**
     * Limit how many LandingPageImages to delete.
     */
    limit?: number
  }

  /**
   * LandingPageImage without action
   */
  export type LandingPageImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageImage
     */
    select?: LandingPageImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageImage
     */
    omit?: LandingPageImageOmit<ExtArgs> | null
  }


  /**
   * Model LandingPageConfig
   */

  export type AggregateLandingPageConfig = {
    _count: LandingPageConfigCountAggregateOutputType | null
    _min: LandingPageConfigMinAggregateOutputType | null
    _max: LandingPageConfigMaxAggregateOutputType | null
  }

  export type LandingPageConfigMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LandingPageConfigMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LandingPageConfigCountAggregateOutputType = {
    id: number
    key: number
    value: number
    type: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LandingPageConfigMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LandingPageConfigMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LandingPageConfigCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LandingPageConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandingPageConfig to aggregate.
     */
    where?: LandingPageConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandingPageConfigs to fetch.
     */
    orderBy?: LandingPageConfigOrderByWithRelationInput | LandingPageConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LandingPageConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandingPageConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandingPageConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LandingPageConfigs
    **/
    _count?: true | LandingPageConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LandingPageConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LandingPageConfigMaxAggregateInputType
  }

  export type GetLandingPageConfigAggregateType<T extends LandingPageConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateLandingPageConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLandingPageConfig[P]>
      : GetScalarType<T[P], AggregateLandingPageConfig[P]>
  }




  export type LandingPageConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LandingPageConfigWhereInput
    orderBy?: LandingPageConfigOrderByWithAggregationInput | LandingPageConfigOrderByWithAggregationInput[]
    by: LandingPageConfigScalarFieldEnum[] | LandingPageConfigScalarFieldEnum
    having?: LandingPageConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LandingPageConfigCountAggregateInputType | true
    _min?: LandingPageConfigMinAggregateInputType
    _max?: LandingPageConfigMaxAggregateInputType
  }

  export type LandingPageConfigGroupByOutputType = {
    id: string
    key: string
    value: string
    type: string
    createdAt: Date
    updatedAt: Date
    _count: LandingPageConfigCountAggregateOutputType | null
    _min: LandingPageConfigMinAggregateOutputType | null
    _max: LandingPageConfigMaxAggregateOutputType | null
  }

  type GetLandingPageConfigGroupByPayload<T extends LandingPageConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LandingPageConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LandingPageConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LandingPageConfigGroupByOutputType[P]>
            : GetScalarType<T[P], LandingPageConfigGroupByOutputType[P]>
        }
      >
    >


  export type LandingPageConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["landingPageConfig"]>



  export type LandingPageConfigSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LandingPageConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value" | "type" | "createdAt" | "updatedAt", ExtArgs["result"]["landingPageConfig"]>

  export type $LandingPageConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LandingPageConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
      type: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["landingPageConfig"]>
    composites: {}
  }

  type LandingPageConfigGetPayload<S extends boolean | null | undefined | LandingPageConfigDefaultArgs> = $Result.GetResult<Prisma.$LandingPageConfigPayload, S>

  type LandingPageConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LandingPageConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LandingPageConfigCountAggregateInputType | true
    }

  export interface LandingPageConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LandingPageConfig'], meta: { name: 'LandingPageConfig' } }
    /**
     * Find zero or one LandingPageConfig that matches the filter.
     * @param {LandingPageConfigFindUniqueArgs} args - Arguments to find a LandingPageConfig
     * @example
     * // Get one LandingPageConfig
     * const landingPageConfig = await prisma.landingPageConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LandingPageConfigFindUniqueArgs>(args: SelectSubset<T, LandingPageConfigFindUniqueArgs<ExtArgs>>): Prisma__LandingPageConfigClient<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LandingPageConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LandingPageConfigFindUniqueOrThrowArgs} args - Arguments to find a LandingPageConfig
     * @example
     * // Get one LandingPageConfig
     * const landingPageConfig = await prisma.landingPageConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LandingPageConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, LandingPageConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LandingPageConfigClient<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandingPageConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageConfigFindFirstArgs} args - Arguments to find a LandingPageConfig
     * @example
     * // Get one LandingPageConfig
     * const landingPageConfig = await prisma.landingPageConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LandingPageConfigFindFirstArgs>(args?: SelectSubset<T, LandingPageConfigFindFirstArgs<ExtArgs>>): Prisma__LandingPageConfigClient<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandingPageConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageConfigFindFirstOrThrowArgs} args - Arguments to find a LandingPageConfig
     * @example
     * // Get one LandingPageConfig
     * const landingPageConfig = await prisma.landingPageConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LandingPageConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, LandingPageConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__LandingPageConfigClient<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LandingPageConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LandingPageConfigs
     * const landingPageConfigs = await prisma.landingPageConfig.findMany()
     * 
     * // Get first 10 LandingPageConfigs
     * const landingPageConfigs = await prisma.landingPageConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const landingPageConfigWithIdOnly = await prisma.landingPageConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LandingPageConfigFindManyArgs>(args?: SelectSubset<T, LandingPageConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LandingPageConfig.
     * @param {LandingPageConfigCreateArgs} args - Arguments to create a LandingPageConfig.
     * @example
     * // Create one LandingPageConfig
     * const LandingPageConfig = await prisma.landingPageConfig.create({
     *   data: {
     *     // ... data to create a LandingPageConfig
     *   }
     * })
     * 
     */
    create<T extends LandingPageConfigCreateArgs>(args: SelectSubset<T, LandingPageConfigCreateArgs<ExtArgs>>): Prisma__LandingPageConfigClient<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LandingPageConfigs.
     * @param {LandingPageConfigCreateManyArgs} args - Arguments to create many LandingPageConfigs.
     * @example
     * // Create many LandingPageConfigs
     * const landingPageConfig = await prisma.landingPageConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LandingPageConfigCreateManyArgs>(args?: SelectSubset<T, LandingPageConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LandingPageConfig.
     * @param {LandingPageConfigDeleteArgs} args - Arguments to delete one LandingPageConfig.
     * @example
     * // Delete one LandingPageConfig
     * const LandingPageConfig = await prisma.landingPageConfig.delete({
     *   where: {
     *     // ... filter to delete one LandingPageConfig
     *   }
     * })
     * 
     */
    delete<T extends LandingPageConfigDeleteArgs>(args: SelectSubset<T, LandingPageConfigDeleteArgs<ExtArgs>>): Prisma__LandingPageConfigClient<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LandingPageConfig.
     * @param {LandingPageConfigUpdateArgs} args - Arguments to update one LandingPageConfig.
     * @example
     * // Update one LandingPageConfig
     * const landingPageConfig = await prisma.landingPageConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LandingPageConfigUpdateArgs>(args: SelectSubset<T, LandingPageConfigUpdateArgs<ExtArgs>>): Prisma__LandingPageConfigClient<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LandingPageConfigs.
     * @param {LandingPageConfigDeleteManyArgs} args - Arguments to filter LandingPageConfigs to delete.
     * @example
     * // Delete a few LandingPageConfigs
     * const { count } = await prisma.landingPageConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LandingPageConfigDeleteManyArgs>(args?: SelectSubset<T, LandingPageConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LandingPageConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LandingPageConfigs
     * const landingPageConfig = await prisma.landingPageConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LandingPageConfigUpdateManyArgs>(args: SelectSubset<T, LandingPageConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LandingPageConfig.
     * @param {LandingPageConfigUpsertArgs} args - Arguments to update or create a LandingPageConfig.
     * @example
     * // Update or create a LandingPageConfig
     * const landingPageConfig = await prisma.landingPageConfig.upsert({
     *   create: {
     *     // ... data to create a LandingPageConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LandingPageConfig we want to update
     *   }
     * })
     */
    upsert<T extends LandingPageConfigUpsertArgs>(args: SelectSubset<T, LandingPageConfigUpsertArgs<ExtArgs>>): Prisma__LandingPageConfigClient<$Result.GetResult<Prisma.$LandingPageConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LandingPageConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageConfigCountArgs} args - Arguments to filter LandingPageConfigs to count.
     * @example
     * // Count the number of LandingPageConfigs
     * const count = await prisma.landingPageConfig.count({
     *   where: {
     *     // ... the filter for the LandingPageConfigs we want to count
     *   }
     * })
    **/
    count<T extends LandingPageConfigCountArgs>(
      args?: Subset<T, LandingPageConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LandingPageConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LandingPageConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LandingPageConfigAggregateArgs>(args: Subset<T, LandingPageConfigAggregateArgs>): Prisma.PrismaPromise<GetLandingPageConfigAggregateType<T>>

    /**
     * Group by LandingPageConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandingPageConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LandingPageConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LandingPageConfigGroupByArgs['orderBy'] }
        : { orderBy?: LandingPageConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LandingPageConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLandingPageConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LandingPageConfig model
   */
  readonly fields: LandingPageConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LandingPageConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LandingPageConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LandingPageConfig model
   */
  interface LandingPageConfigFieldRefs {
    readonly id: FieldRef<"LandingPageConfig", 'String'>
    readonly key: FieldRef<"LandingPageConfig", 'String'>
    readonly value: FieldRef<"LandingPageConfig", 'String'>
    readonly type: FieldRef<"LandingPageConfig", 'String'>
    readonly createdAt: FieldRef<"LandingPageConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"LandingPageConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LandingPageConfig findUnique
   */
  export type LandingPageConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageConfig to fetch.
     */
    where: LandingPageConfigWhereUniqueInput
  }

  /**
   * LandingPageConfig findUniqueOrThrow
   */
  export type LandingPageConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageConfig to fetch.
     */
    where: LandingPageConfigWhereUniqueInput
  }

  /**
   * LandingPageConfig findFirst
   */
  export type LandingPageConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageConfig to fetch.
     */
    where?: LandingPageConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandingPageConfigs to fetch.
     */
    orderBy?: LandingPageConfigOrderByWithRelationInput | LandingPageConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandingPageConfigs.
     */
    cursor?: LandingPageConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandingPageConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandingPageConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandingPageConfigs.
     */
    distinct?: LandingPageConfigScalarFieldEnum | LandingPageConfigScalarFieldEnum[]
  }

  /**
   * LandingPageConfig findFirstOrThrow
   */
  export type LandingPageConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageConfig to fetch.
     */
    where?: LandingPageConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandingPageConfigs to fetch.
     */
    orderBy?: LandingPageConfigOrderByWithRelationInput | LandingPageConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandingPageConfigs.
     */
    cursor?: LandingPageConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandingPageConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandingPageConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandingPageConfigs.
     */
    distinct?: LandingPageConfigScalarFieldEnum | LandingPageConfigScalarFieldEnum[]
  }

  /**
   * LandingPageConfig findMany
   */
  export type LandingPageConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * Filter, which LandingPageConfigs to fetch.
     */
    where?: LandingPageConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandingPageConfigs to fetch.
     */
    orderBy?: LandingPageConfigOrderByWithRelationInput | LandingPageConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LandingPageConfigs.
     */
    cursor?: LandingPageConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandingPageConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandingPageConfigs.
     */
    skip?: number
    distinct?: LandingPageConfigScalarFieldEnum | LandingPageConfigScalarFieldEnum[]
  }

  /**
   * LandingPageConfig create
   */
  export type LandingPageConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a LandingPageConfig.
     */
    data: XOR<LandingPageConfigCreateInput, LandingPageConfigUncheckedCreateInput>
  }

  /**
   * LandingPageConfig createMany
   */
  export type LandingPageConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LandingPageConfigs.
     */
    data: LandingPageConfigCreateManyInput | LandingPageConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LandingPageConfig update
   */
  export type LandingPageConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a LandingPageConfig.
     */
    data: XOR<LandingPageConfigUpdateInput, LandingPageConfigUncheckedUpdateInput>
    /**
     * Choose, which LandingPageConfig to update.
     */
    where: LandingPageConfigWhereUniqueInput
  }

  /**
   * LandingPageConfig updateMany
   */
  export type LandingPageConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LandingPageConfigs.
     */
    data: XOR<LandingPageConfigUpdateManyMutationInput, LandingPageConfigUncheckedUpdateManyInput>
    /**
     * Filter which LandingPageConfigs to update
     */
    where?: LandingPageConfigWhereInput
    /**
     * Limit how many LandingPageConfigs to update.
     */
    limit?: number
  }

  /**
   * LandingPageConfig upsert
   */
  export type LandingPageConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the LandingPageConfig to update in case it exists.
     */
    where: LandingPageConfigWhereUniqueInput
    /**
     * In case the LandingPageConfig found by the `where` argument doesn't exist, create a new LandingPageConfig with this data.
     */
    create: XOR<LandingPageConfigCreateInput, LandingPageConfigUncheckedCreateInput>
    /**
     * In case the LandingPageConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LandingPageConfigUpdateInput, LandingPageConfigUncheckedUpdateInput>
  }

  /**
   * LandingPageConfig delete
   */
  export type LandingPageConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
    /**
     * Filter which LandingPageConfig to delete.
     */
    where: LandingPageConfigWhereUniqueInput
  }

  /**
   * LandingPageConfig deleteMany
   */
  export type LandingPageConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandingPageConfigs to delete
     */
    where?: LandingPageConfigWhereInput
    /**
     * Limit how many LandingPageConfigs to delete.
     */
    limit?: number
  }

  /**
   * LandingPageConfig without action
   */
  export type LandingPageConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandingPageConfig
     */
    select?: LandingPageConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandingPageConfig
     */
    omit?: LandingPageConfigOmit<ExtArgs> | null
  }


  /**
   * Model Report
   */

  export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  export type ReportMinAggregateOutputType = {
    id: string | null
    type: string | null
    period: string | null
    generatedAt: Date | null
    periodStart: Date | null
    periodEnd: Date | null
  }

  export type ReportMaxAggregateOutputType = {
    id: string | null
    type: string | null
    period: string | null
    generatedAt: Date | null
    periodStart: Date | null
    periodEnd: Date | null
  }

  export type ReportCountAggregateOutputType = {
    id: number
    type: number
    period: number
    data: number
    generatedAt: number
    periodStart: number
    periodEnd: number
    _all: number
  }


  export type ReportMinAggregateInputType = {
    id?: true
    type?: true
    period?: true
    generatedAt?: true
    periodStart?: true
    periodEnd?: true
  }

  export type ReportMaxAggregateInputType = {
    id?: true
    type?: true
    period?: true
    generatedAt?: true
    periodStart?: true
    periodEnd?: true
  }

  export type ReportCountAggregateInputType = {
    id?: true
    type?: true
    period?: true
    data?: true
    generatedAt?: true
    periodStart?: true
    periodEnd?: true
    _all?: true
  }

  export type ReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Report to aggregate.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reports
    **/
    _count?: true | ReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportMaxAggregateInputType
  }

  export type GetReportAggregateType<T extends ReportAggregateArgs> = {
        [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReport[P]>
      : GetScalarType<T[P], AggregateReport[P]>
  }




  export type ReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithAggregationInput | ReportOrderByWithAggregationInput[]
    by: ReportScalarFieldEnum[] | ReportScalarFieldEnum
    having?: ReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportCountAggregateInputType | true
    _min?: ReportMinAggregateInputType
    _max?: ReportMaxAggregateInputType
  }

  export type ReportGroupByOutputType = {
    id: string
    type: string
    period: string
    data: JsonValue
    generatedAt: Date
    periodStart: Date
    periodEnd: Date
    _count: ReportCountAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportGroupByOutputType[P]>
            : GetScalarType<T[P], ReportGroupByOutputType[P]>
        }
      >
    >


  export type ReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    period?: boolean
    data?: boolean
    generatedAt?: boolean
    periodStart?: boolean
    periodEnd?: boolean
  }, ExtArgs["result"]["report"]>



  export type ReportSelectScalar = {
    id?: boolean
    type?: boolean
    period?: boolean
    data?: boolean
    generatedAt?: boolean
    periodStart?: boolean
    periodEnd?: boolean
  }

  export type ReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "period" | "data" | "generatedAt" | "periodStart" | "periodEnd", ExtArgs["result"]["report"]>

  export type $ReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Report"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      period: string
      data: Prisma.JsonValue
      generatedAt: Date
      periodStart: Date
      periodEnd: Date
    }, ExtArgs["result"]["report"]>
    composites: {}
  }

  type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = $Result.GetResult<Prisma.$ReportPayload, S>

  type ReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportCountAggregateInputType | true
    }

  export interface ReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Report'], meta: { name: 'Report' } }
    /**
     * Find zero or one Report that matches the filter.
     * @param {ReportFindUniqueArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportFindUniqueArgs>(args: SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Report that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReportFindUniqueOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportFindFirstArgs>(args?: SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.report.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.report.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportWithIdOnly = await prisma.report.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportFindManyArgs>(args?: SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Report.
     * @param {ReportCreateArgs} args - Arguments to create a Report.
     * @example
     * // Create one Report
     * const Report = await prisma.report.create({
     *   data: {
     *     // ... data to create a Report
     *   }
     * })
     * 
     */
    create<T extends ReportCreateArgs>(args: SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reports.
     * @param {ReportCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportCreateManyArgs>(args?: SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Report.
     * @param {ReportDeleteArgs} args - Arguments to delete one Report.
     * @example
     * // Delete one Report
     * const Report = await prisma.report.delete({
     *   where: {
     *     // ... filter to delete one Report
     *   }
     * })
     * 
     */
    delete<T extends ReportDeleteArgs>(args: SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Report.
     * @param {ReportUpdateArgs} args - Arguments to update one Report.
     * @example
     * // Update one Report
     * const report = await prisma.report.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportUpdateArgs>(args: SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reports.
     * @param {ReportDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.report.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportDeleteManyArgs>(args?: SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportUpdateManyArgs>(args: SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Report.
     * @param {ReportUpsertArgs} args - Arguments to update or create a Report.
     * @example
     * // Update or create a Report
     * const report = await prisma.report.upsert({
     *   create: {
     *     // ... data to create a Report
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Report we want to update
     *   }
     * })
     */
    upsert<T extends ReportUpsertArgs>(args: SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.report.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends ReportCountArgs>(
      args?: Subset<T, ReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportAggregateArgs>(args: Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>

    /**
     * Group by Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportGroupByArgs['orderBy'] }
        : { orderBy?: ReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Report model
   */
  readonly fields: ReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Report.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Report model
   */
  interface ReportFieldRefs {
    readonly id: FieldRef<"Report", 'String'>
    readonly type: FieldRef<"Report", 'String'>
    readonly period: FieldRef<"Report", 'String'>
    readonly data: FieldRef<"Report", 'Json'>
    readonly generatedAt: FieldRef<"Report", 'DateTime'>
    readonly periodStart: FieldRef<"Report", 'DateTime'>
    readonly periodEnd: FieldRef<"Report", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Report findUnique
   */
  export type ReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findUniqueOrThrow
   */
  export type ReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findFirst
   */
  export type ReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findFirstOrThrow
   */
  export type ReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findMany
   */
  export type ReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter, which Reports to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report create
   */
  export type ReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data needed to create a Report.
     */
    data: XOR<ReportCreateInput, ReportUncheckedCreateInput>
  }

  /**
   * Report createMany
   */
  export type ReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Report update
   */
  export type ReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The data needed to update a Report.
     */
    data: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
    /**
     * Choose, which Report to update.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report updateMany
   */
  export type ReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
  }

  /**
   * Report upsert
   */
  export type ReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * The filter to search for the Report to update in case it exists.
     */
    where: ReportWhereUniqueInput
    /**
     * In case the Report found by the `where` argument doesn't exist, create a new Report with this data.
     */
    create: XOR<ReportCreateInput, ReportUncheckedCreateInput>
    /**
     * In case the Report was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
  }

  /**
   * Report delete
   */
  export type ReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Filter which Report to delete.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report deleteMany
   */
  export type ReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reports to delete
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to delete.
     */
    limit?: number
  }

  /**
   * Report without action
   */
  export type ReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
  }


  /**
   * Model ExpirationNotification
   */

  export type AggregateExpirationNotification = {
    _count: ExpirationNotificationCountAggregateOutputType | null
    _avg: ExpirationNotificationAvgAggregateOutputType | null
    _sum: ExpirationNotificationSumAggregateOutputType | null
    _min: ExpirationNotificationMinAggregateOutputType | null
    _max: ExpirationNotificationMaxAggregateOutputType | null
  }

  export type ExpirationNotificationAvgAggregateOutputType = {
    daysLeft: number | null
  }

  export type ExpirationNotificationSumAggregateOutputType = {
    daysLeft: number | null
  }

  export type ExpirationNotificationMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    type: string | null
    daysLeft: number | null
    sentAt: Date | null
    emailSent: boolean | null
  }

  export type ExpirationNotificationMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    type: string | null
    daysLeft: number | null
    sentAt: Date | null
    emailSent: boolean | null
  }

  export type ExpirationNotificationCountAggregateOutputType = {
    id: number
    tenantId: number
    type: number
    daysLeft: number
    sentAt: number
    emailSent: number
    _all: number
  }


  export type ExpirationNotificationAvgAggregateInputType = {
    daysLeft?: true
  }

  export type ExpirationNotificationSumAggregateInputType = {
    daysLeft?: true
  }

  export type ExpirationNotificationMinAggregateInputType = {
    id?: true
    tenantId?: true
    type?: true
    daysLeft?: true
    sentAt?: true
    emailSent?: true
  }

  export type ExpirationNotificationMaxAggregateInputType = {
    id?: true
    tenantId?: true
    type?: true
    daysLeft?: true
    sentAt?: true
    emailSent?: true
  }

  export type ExpirationNotificationCountAggregateInputType = {
    id?: true
    tenantId?: true
    type?: true
    daysLeft?: true
    sentAt?: true
    emailSent?: true
    _all?: true
  }

  export type ExpirationNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExpirationNotification to aggregate.
     */
    where?: ExpirationNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpirationNotifications to fetch.
     */
    orderBy?: ExpirationNotificationOrderByWithRelationInput | ExpirationNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExpirationNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpirationNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpirationNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExpirationNotifications
    **/
    _count?: true | ExpirationNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExpirationNotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExpirationNotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExpirationNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExpirationNotificationMaxAggregateInputType
  }

  export type GetExpirationNotificationAggregateType<T extends ExpirationNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateExpirationNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExpirationNotification[P]>
      : GetScalarType<T[P], AggregateExpirationNotification[P]>
  }




  export type ExpirationNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpirationNotificationWhereInput
    orderBy?: ExpirationNotificationOrderByWithAggregationInput | ExpirationNotificationOrderByWithAggregationInput[]
    by: ExpirationNotificationScalarFieldEnum[] | ExpirationNotificationScalarFieldEnum
    having?: ExpirationNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExpirationNotificationCountAggregateInputType | true
    _avg?: ExpirationNotificationAvgAggregateInputType
    _sum?: ExpirationNotificationSumAggregateInputType
    _min?: ExpirationNotificationMinAggregateInputType
    _max?: ExpirationNotificationMaxAggregateInputType
  }

  export type ExpirationNotificationGroupByOutputType = {
    id: string
    tenantId: string
    type: string
    daysLeft: number | null
    sentAt: Date
    emailSent: boolean
    _count: ExpirationNotificationCountAggregateOutputType | null
    _avg: ExpirationNotificationAvgAggregateOutputType | null
    _sum: ExpirationNotificationSumAggregateOutputType | null
    _min: ExpirationNotificationMinAggregateOutputType | null
    _max: ExpirationNotificationMaxAggregateOutputType | null
  }

  type GetExpirationNotificationGroupByPayload<T extends ExpirationNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExpirationNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExpirationNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExpirationNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], ExpirationNotificationGroupByOutputType[P]>
        }
      >
    >


  export type ExpirationNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    type?: boolean
    daysLeft?: boolean
    sentAt?: boolean
    emailSent?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expirationNotification"]>



  export type ExpirationNotificationSelectScalar = {
    id?: boolean
    tenantId?: boolean
    type?: boolean
    daysLeft?: boolean
    sentAt?: boolean
    emailSent?: boolean
  }

  export type ExpirationNotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "type" | "daysLeft" | "sentAt" | "emailSent", ExtArgs["result"]["expirationNotification"]>
  export type ExpirationNotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $ExpirationNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExpirationNotification"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      type: string
      daysLeft: number | null
      sentAt: Date
      emailSent: boolean
    }, ExtArgs["result"]["expirationNotification"]>
    composites: {}
  }

  type ExpirationNotificationGetPayload<S extends boolean | null | undefined | ExpirationNotificationDefaultArgs> = $Result.GetResult<Prisma.$ExpirationNotificationPayload, S>

  type ExpirationNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExpirationNotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExpirationNotificationCountAggregateInputType | true
    }

  export interface ExpirationNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExpirationNotification'], meta: { name: 'ExpirationNotification' } }
    /**
     * Find zero or one ExpirationNotification that matches the filter.
     * @param {ExpirationNotificationFindUniqueArgs} args - Arguments to find a ExpirationNotification
     * @example
     * // Get one ExpirationNotification
     * const expirationNotification = await prisma.expirationNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExpirationNotificationFindUniqueArgs>(args: SelectSubset<T, ExpirationNotificationFindUniqueArgs<ExtArgs>>): Prisma__ExpirationNotificationClient<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExpirationNotification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExpirationNotificationFindUniqueOrThrowArgs} args - Arguments to find a ExpirationNotification
     * @example
     * // Get one ExpirationNotification
     * const expirationNotification = await prisma.expirationNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExpirationNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, ExpirationNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExpirationNotificationClient<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExpirationNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpirationNotificationFindFirstArgs} args - Arguments to find a ExpirationNotification
     * @example
     * // Get one ExpirationNotification
     * const expirationNotification = await prisma.expirationNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExpirationNotificationFindFirstArgs>(args?: SelectSubset<T, ExpirationNotificationFindFirstArgs<ExtArgs>>): Prisma__ExpirationNotificationClient<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExpirationNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpirationNotificationFindFirstOrThrowArgs} args - Arguments to find a ExpirationNotification
     * @example
     * // Get one ExpirationNotification
     * const expirationNotification = await prisma.expirationNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExpirationNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, ExpirationNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExpirationNotificationClient<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExpirationNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpirationNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExpirationNotifications
     * const expirationNotifications = await prisma.expirationNotification.findMany()
     * 
     * // Get first 10 ExpirationNotifications
     * const expirationNotifications = await prisma.expirationNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const expirationNotificationWithIdOnly = await prisma.expirationNotification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExpirationNotificationFindManyArgs>(args?: SelectSubset<T, ExpirationNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExpirationNotification.
     * @param {ExpirationNotificationCreateArgs} args - Arguments to create a ExpirationNotification.
     * @example
     * // Create one ExpirationNotification
     * const ExpirationNotification = await prisma.expirationNotification.create({
     *   data: {
     *     // ... data to create a ExpirationNotification
     *   }
     * })
     * 
     */
    create<T extends ExpirationNotificationCreateArgs>(args: SelectSubset<T, ExpirationNotificationCreateArgs<ExtArgs>>): Prisma__ExpirationNotificationClient<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExpirationNotifications.
     * @param {ExpirationNotificationCreateManyArgs} args - Arguments to create many ExpirationNotifications.
     * @example
     * // Create many ExpirationNotifications
     * const expirationNotification = await prisma.expirationNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExpirationNotificationCreateManyArgs>(args?: SelectSubset<T, ExpirationNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ExpirationNotification.
     * @param {ExpirationNotificationDeleteArgs} args - Arguments to delete one ExpirationNotification.
     * @example
     * // Delete one ExpirationNotification
     * const ExpirationNotification = await prisma.expirationNotification.delete({
     *   where: {
     *     // ... filter to delete one ExpirationNotification
     *   }
     * })
     * 
     */
    delete<T extends ExpirationNotificationDeleteArgs>(args: SelectSubset<T, ExpirationNotificationDeleteArgs<ExtArgs>>): Prisma__ExpirationNotificationClient<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExpirationNotification.
     * @param {ExpirationNotificationUpdateArgs} args - Arguments to update one ExpirationNotification.
     * @example
     * // Update one ExpirationNotification
     * const expirationNotification = await prisma.expirationNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExpirationNotificationUpdateArgs>(args: SelectSubset<T, ExpirationNotificationUpdateArgs<ExtArgs>>): Prisma__ExpirationNotificationClient<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExpirationNotifications.
     * @param {ExpirationNotificationDeleteManyArgs} args - Arguments to filter ExpirationNotifications to delete.
     * @example
     * // Delete a few ExpirationNotifications
     * const { count } = await prisma.expirationNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExpirationNotificationDeleteManyArgs>(args?: SelectSubset<T, ExpirationNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExpirationNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpirationNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExpirationNotifications
     * const expirationNotification = await prisma.expirationNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExpirationNotificationUpdateManyArgs>(args: SelectSubset<T, ExpirationNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExpirationNotification.
     * @param {ExpirationNotificationUpsertArgs} args - Arguments to update or create a ExpirationNotification.
     * @example
     * // Update or create a ExpirationNotification
     * const expirationNotification = await prisma.expirationNotification.upsert({
     *   create: {
     *     // ... data to create a ExpirationNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExpirationNotification we want to update
     *   }
     * })
     */
    upsert<T extends ExpirationNotificationUpsertArgs>(args: SelectSubset<T, ExpirationNotificationUpsertArgs<ExtArgs>>): Prisma__ExpirationNotificationClient<$Result.GetResult<Prisma.$ExpirationNotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExpirationNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpirationNotificationCountArgs} args - Arguments to filter ExpirationNotifications to count.
     * @example
     * // Count the number of ExpirationNotifications
     * const count = await prisma.expirationNotification.count({
     *   where: {
     *     // ... the filter for the ExpirationNotifications we want to count
     *   }
     * })
    **/
    count<T extends ExpirationNotificationCountArgs>(
      args?: Subset<T, ExpirationNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExpirationNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExpirationNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpirationNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExpirationNotificationAggregateArgs>(args: Subset<T, ExpirationNotificationAggregateArgs>): Prisma.PrismaPromise<GetExpirationNotificationAggregateType<T>>

    /**
     * Group by ExpirationNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpirationNotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExpirationNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExpirationNotificationGroupByArgs['orderBy'] }
        : { orderBy?: ExpirationNotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExpirationNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExpirationNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExpirationNotification model
   */
  readonly fields: ExpirationNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExpirationNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExpirationNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExpirationNotification model
   */
  interface ExpirationNotificationFieldRefs {
    readonly id: FieldRef<"ExpirationNotification", 'String'>
    readonly tenantId: FieldRef<"ExpirationNotification", 'String'>
    readonly type: FieldRef<"ExpirationNotification", 'String'>
    readonly daysLeft: FieldRef<"ExpirationNotification", 'Int'>
    readonly sentAt: FieldRef<"ExpirationNotification", 'DateTime'>
    readonly emailSent: FieldRef<"ExpirationNotification", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * ExpirationNotification findUnique
   */
  export type ExpirationNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * Filter, which ExpirationNotification to fetch.
     */
    where: ExpirationNotificationWhereUniqueInput
  }

  /**
   * ExpirationNotification findUniqueOrThrow
   */
  export type ExpirationNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * Filter, which ExpirationNotification to fetch.
     */
    where: ExpirationNotificationWhereUniqueInput
  }

  /**
   * ExpirationNotification findFirst
   */
  export type ExpirationNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * Filter, which ExpirationNotification to fetch.
     */
    where?: ExpirationNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpirationNotifications to fetch.
     */
    orderBy?: ExpirationNotificationOrderByWithRelationInput | ExpirationNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExpirationNotifications.
     */
    cursor?: ExpirationNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpirationNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpirationNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExpirationNotifications.
     */
    distinct?: ExpirationNotificationScalarFieldEnum | ExpirationNotificationScalarFieldEnum[]
  }

  /**
   * ExpirationNotification findFirstOrThrow
   */
  export type ExpirationNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * Filter, which ExpirationNotification to fetch.
     */
    where?: ExpirationNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpirationNotifications to fetch.
     */
    orderBy?: ExpirationNotificationOrderByWithRelationInput | ExpirationNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExpirationNotifications.
     */
    cursor?: ExpirationNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpirationNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpirationNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExpirationNotifications.
     */
    distinct?: ExpirationNotificationScalarFieldEnum | ExpirationNotificationScalarFieldEnum[]
  }

  /**
   * ExpirationNotification findMany
   */
  export type ExpirationNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * Filter, which ExpirationNotifications to fetch.
     */
    where?: ExpirationNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpirationNotifications to fetch.
     */
    orderBy?: ExpirationNotificationOrderByWithRelationInput | ExpirationNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExpirationNotifications.
     */
    cursor?: ExpirationNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpirationNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpirationNotifications.
     */
    skip?: number
    distinct?: ExpirationNotificationScalarFieldEnum | ExpirationNotificationScalarFieldEnum[]
  }

  /**
   * ExpirationNotification create
   */
  export type ExpirationNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a ExpirationNotification.
     */
    data: XOR<ExpirationNotificationCreateInput, ExpirationNotificationUncheckedCreateInput>
  }

  /**
   * ExpirationNotification createMany
   */
  export type ExpirationNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExpirationNotifications.
     */
    data: ExpirationNotificationCreateManyInput | ExpirationNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExpirationNotification update
   */
  export type ExpirationNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a ExpirationNotification.
     */
    data: XOR<ExpirationNotificationUpdateInput, ExpirationNotificationUncheckedUpdateInput>
    /**
     * Choose, which ExpirationNotification to update.
     */
    where: ExpirationNotificationWhereUniqueInput
  }

  /**
   * ExpirationNotification updateMany
   */
  export type ExpirationNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExpirationNotifications.
     */
    data: XOR<ExpirationNotificationUpdateManyMutationInput, ExpirationNotificationUncheckedUpdateManyInput>
    /**
     * Filter which ExpirationNotifications to update
     */
    where?: ExpirationNotificationWhereInput
    /**
     * Limit how many ExpirationNotifications to update.
     */
    limit?: number
  }

  /**
   * ExpirationNotification upsert
   */
  export type ExpirationNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the ExpirationNotification to update in case it exists.
     */
    where: ExpirationNotificationWhereUniqueInput
    /**
     * In case the ExpirationNotification found by the `where` argument doesn't exist, create a new ExpirationNotification with this data.
     */
    create: XOR<ExpirationNotificationCreateInput, ExpirationNotificationUncheckedCreateInput>
    /**
     * In case the ExpirationNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExpirationNotificationUpdateInput, ExpirationNotificationUncheckedUpdateInput>
  }

  /**
   * ExpirationNotification delete
   */
  export type ExpirationNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
    /**
     * Filter which ExpirationNotification to delete.
     */
    where: ExpirationNotificationWhereUniqueInput
  }

  /**
   * ExpirationNotification deleteMany
   */
  export type ExpirationNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExpirationNotifications to delete
     */
    where?: ExpirationNotificationWhereInput
    /**
     * Limit how many ExpirationNotifications to delete.
     */
    limit?: number
  }

  /**
   * ExpirationNotification without action
   */
  export type ExpirationNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpirationNotification
     */
    select?: ExpirationNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpirationNotification
     */
    omit?: ExpirationNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpirationNotificationInclude<ExtArgs> | null
  }


  /**
   * Model SuperAdminAccess
   */

  export type AggregateSuperAdminAccess = {
    _count: SuperAdminAccessCountAggregateOutputType | null
    _min: SuperAdminAccessMinAggregateOutputType | null
    _max: SuperAdminAccessMaxAggregateOutputType | null
  }

  export type SuperAdminAccessMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    adminEmail: string | null
    accessToken: string | null
    lastAccessed: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SuperAdminAccessMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    adminEmail: string | null
    accessToken: string | null
    lastAccessed: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SuperAdminAccessCountAggregateOutputType = {
    id: number
    tenantId: number
    adminEmail: number
    accessToken: number
    lastAccessed: number
    accessLogs: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SuperAdminAccessMinAggregateInputType = {
    id?: true
    tenantId?: true
    adminEmail?: true
    accessToken?: true
    lastAccessed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SuperAdminAccessMaxAggregateInputType = {
    id?: true
    tenantId?: true
    adminEmail?: true
    accessToken?: true
    lastAccessed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SuperAdminAccessCountAggregateInputType = {
    id?: true
    tenantId?: true
    adminEmail?: true
    accessToken?: true
    lastAccessed?: true
    accessLogs?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SuperAdminAccessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdminAccess to aggregate.
     */
    where?: SuperAdminAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdminAccesses to fetch.
     */
    orderBy?: SuperAdminAccessOrderByWithRelationInput | SuperAdminAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SuperAdminAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdminAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdminAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SuperAdminAccesses
    **/
    _count?: true | SuperAdminAccessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SuperAdminAccessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SuperAdminAccessMaxAggregateInputType
  }

  export type GetSuperAdminAccessAggregateType<T extends SuperAdminAccessAggregateArgs> = {
        [P in keyof T & keyof AggregateSuperAdminAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuperAdminAccess[P]>
      : GetScalarType<T[P], AggregateSuperAdminAccess[P]>
  }




  export type SuperAdminAccessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuperAdminAccessWhereInput
    orderBy?: SuperAdminAccessOrderByWithAggregationInput | SuperAdminAccessOrderByWithAggregationInput[]
    by: SuperAdminAccessScalarFieldEnum[] | SuperAdminAccessScalarFieldEnum
    having?: SuperAdminAccessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuperAdminAccessCountAggregateInputType | true
    _min?: SuperAdminAccessMinAggregateInputType
    _max?: SuperAdminAccessMaxAggregateInputType
  }

  export type SuperAdminAccessGroupByOutputType = {
    id: string
    tenantId: string
    adminEmail: string
    accessToken: string | null
    lastAccessed: Date | null
    accessLogs: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: SuperAdminAccessCountAggregateOutputType | null
    _min: SuperAdminAccessMinAggregateOutputType | null
    _max: SuperAdminAccessMaxAggregateOutputType | null
  }

  type GetSuperAdminAccessGroupByPayload<T extends SuperAdminAccessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuperAdminAccessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SuperAdminAccessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SuperAdminAccessGroupByOutputType[P]>
            : GetScalarType<T[P], SuperAdminAccessGroupByOutputType[P]>
        }
      >
    >


  export type SuperAdminAccessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    adminEmail?: boolean
    accessToken?: boolean
    lastAccessed?: boolean
    accessLogs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["superAdminAccess"]>



  export type SuperAdminAccessSelectScalar = {
    id?: boolean
    tenantId?: boolean
    adminEmail?: boolean
    accessToken?: boolean
    lastAccessed?: boolean
    accessLogs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SuperAdminAccessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "adminEmail" | "accessToken" | "lastAccessed" | "accessLogs" | "createdAt" | "updatedAt", ExtArgs["result"]["superAdminAccess"]>
  export type SuperAdminAccessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $SuperAdminAccessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SuperAdminAccess"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      adminEmail: string
      accessToken: string | null
      lastAccessed: Date | null
      accessLogs: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["superAdminAccess"]>
    composites: {}
  }

  type SuperAdminAccessGetPayload<S extends boolean | null | undefined | SuperAdminAccessDefaultArgs> = $Result.GetResult<Prisma.$SuperAdminAccessPayload, S>

  type SuperAdminAccessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SuperAdminAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SuperAdminAccessCountAggregateInputType | true
    }

  export interface SuperAdminAccessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuperAdminAccess'], meta: { name: 'SuperAdminAccess' } }
    /**
     * Find zero or one SuperAdminAccess that matches the filter.
     * @param {SuperAdminAccessFindUniqueArgs} args - Arguments to find a SuperAdminAccess
     * @example
     * // Get one SuperAdminAccess
     * const superAdminAccess = await prisma.superAdminAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SuperAdminAccessFindUniqueArgs>(args: SelectSubset<T, SuperAdminAccessFindUniqueArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SuperAdminAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SuperAdminAccessFindUniqueOrThrowArgs} args - Arguments to find a SuperAdminAccess
     * @example
     * // Get one SuperAdminAccess
     * const superAdminAccess = await prisma.superAdminAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SuperAdminAccessFindUniqueOrThrowArgs>(args: SelectSubset<T, SuperAdminAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SuperAdminAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAccessFindFirstArgs} args - Arguments to find a SuperAdminAccess
     * @example
     * // Get one SuperAdminAccess
     * const superAdminAccess = await prisma.superAdminAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SuperAdminAccessFindFirstArgs>(args?: SelectSubset<T, SuperAdminAccessFindFirstArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SuperAdminAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAccessFindFirstOrThrowArgs} args - Arguments to find a SuperAdminAccess
     * @example
     * // Get one SuperAdminAccess
     * const superAdminAccess = await prisma.superAdminAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SuperAdminAccessFindFirstOrThrowArgs>(args?: SelectSubset<T, SuperAdminAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SuperAdminAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuperAdminAccesses
     * const superAdminAccesses = await prisma.superAdminAccess.findMany()
     * 
     * // Get first 10 SuperAdminAccesses
     * const superAdminAccesses = await prisma.superAdminAccess.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const superAdminAccessWithIdOnly = await prisma.superAdminAccess.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SuperAdminAccessFindManyArgs>(args?: SelectSubset<T, SuperAdminAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SuperAdminAccess.
     * @param {SuperAdminAccessCreateArgs} args - Arguments to create a SuperAdminAccess.
     * @example
     * // Create one SuperAdminAccess
     * const SuperAdminAccess = await prisma.superAdminAccess.create({
     *   data: {
     *     // ... data to create a SuperAdminAccess
     *   }
     * })
     * 
     */
    create<T extends SuperAdminAccessCreateArgs>(args: SelectSubset<T, SuperAdminAccessCreateArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SuperAdminAccesses.
     * @param {SuperAdminAccessCreateManyArgs} args - Arguments to create many SuperAdminAccesses.
     * @example
     * // Create many SuperAdminAccesses
     * const superAdminAccess = await prisma.superAdminAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SuperAdminAccessCreateManyArgs>(args?: SelectSubset<T, SuperAdminAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SuperAdminAccess.
     * @param {SuperAdminAccessDeleteArgs} args - Arguments to delete one SuperAdminAccess.
     * @example
     * // Delete one SuperAdminAccess
     * const SuperAdminAccess = await prisma.superAdminAccess.delete({
     *   where: {
     *     // ... filter to delete one SuperAdminAccess
     *   }
     * })
     * 
     */
    delete<T extends SuperAdminAccessDeleteArgs>(args: SelectSubset<T, SuperAdminAccessDeleteArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SuperAdminAccess.
     * @param {SuperAdminAccessUpdateArgs} args - Arguments to update one SuperAdminAccess.
     * @example
     * // Update one SuperAdminAccess
     * const superAdminAccess = await prisma.superAdminAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SuperAdminAccessUpdateArgs>(args: SelectSubset<T, SuperAdminAccessUpdateArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SuperAdminAccesses.
     * @param {SuperAdminAccessDeleteManyArgs} args - Arguments to filter SuperAdminAccesses to delete.
     * @example
     * // Delete a few SuperAdminAccesses
     * const { count } = await prisma.superAdminAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SuperAdminAccessDeleteManyArgs>(args?: SelectSubset<T, SuperAdminAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdminAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuperAdminAccesses
     * const superAdminAccess = await prisma.superAdminAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SuperAdminAccessUpdateManyArgs>(args: SelectSubset<T, SuperAdminAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SuperAdminAccess.
     * @param {SuperAdminAccessUpsertArgs} args - Arguments to update or create a SuperAdminAccess.
     * @example
     * // Update or create a SuperAdminAccess
     * const superAdminAccess = await prisma.superAdminAccess.upsert({
     *   create: {
     *     // ... data to create a SuperAdminAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuperAdminAccess we want to update
     *   }
     * })
     */
    upsert<T extends SuperAdminAccessUpsertArgs>(args: SelectSubset<T, SuperAdminAccessUpsertArgs<ExtArgs>>): Prisma__SuperAdminAccessClient<$Result.GetResult<Prisma.$SuperAdminAccessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SuperAdminAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAccessCountArgs} args - Arguments to filter SuperAdminAccesses to count.
     * @example
     * // Count the number of SuperAdminAccesses
     * const count = await prisma.superAdminAccess.count({
     *   where: {
     *     // ... the filter for the SuperAdminAccesses we want to count
     *   }
     * })
    **/
    count<T extends SuperAdminAccessCountArgs>(
      args?: Subset<T, SuperAdminAccessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuperAdminAccessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuperAdminAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SuperAdminAccessAggregateArgs>(args: Subset<T, SuperAdminAccessAggregateArgs>): Prisma.PrismaPromise<GetSuperAdminAccessAggregateType<T>>

    /**
     * Group by SuperAdminAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAccessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SuperAdminAccessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuperAdminAccessGroupByArgs['orderBy'] }
        : { orderBy?: SuperAdminAccessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SuperAdminAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuperAdminAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SuperAdminAccess model
   */
  readonly fields: SuperAdminAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuperAdminAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuperAdminAccessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SuperAdminAccess model
   */
  interface SuperAdminAccessFieldRefs {
    readonly id: FieldRef<"SuperAdminAccess", 'String'>
    readonly tenantId: FieldRef<"SuperAdminAccess", 'String'>
    readonly adminEmail: FieldRef<"SuperAdminAccess", 'String'>
    readonly accessToken: FieldRef<"SuperAdminAccess", 'String'>
    readonly lastAccessed: FieldRef<"SuperAdminAccess", 'DateTime'>
    readonly accessLogs: FieldRef<"SuperAdminAccess", 'Json'>
    readonly createdAt: FieldRef<"SuperAdminAccess", 'DateTime'>
    readonly updatedAt: FieldRef<"SuperAdminAccess", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SuperAdminAccess findUnique
   */
  export type SuperAdminAccessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminAccess to fetch.
     */
    where: SuperAdminAccessWhereUniqueInput
  }

  /**
   * SuperAdminAccess findUniqueOrThrow
   */
  export type SuperAdminAccessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminAccess to fetch.
     */
    where: SuperAdminAccessWhereUniqueInput
  }

  /**
   * SuperAdminAccess findFirst
   */
  export type SuperAdminAccessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminAccess to fetch.
     */
    where?: SuperAdminAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdminAccesses to fetch.
     */
    orderBy?: SuperAdminAccessOrderByWithRelationInput | SuperAdminAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdminAccesses.
     */
    cursor?: SuperAdminAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdminAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdminAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdminAccesses.
     */
    distinct?: SuperAdminAccessScalarFieldEnum | SuperAdminAccessScalarFieldEnum[]
  }

  /**
   * SuperAdminAccess findFirstOrThrow
   */
  export type SuperAdminAccessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminAccess to fetch.
     */
    where?: SuperAdminAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdminAccesses to fetch.
     */
    orderBy?: SuperAdminAccessOrderByWithRelationInput | SuperAdminAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdminAccesses.
     */
    cursor?: SuperAdminAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdminAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdminAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdminAccesses.
     */
    distinct?: SuperAdminAccessScalarFieldEnum | SuperAdminAccessScalarFieldEnum[]
  }

  /**
   * SuperAdminAccess findMany
   */
  export type SuperAdminAccessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminAccesses to fetch.
     */
    where?: SuperAdminAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdminAccesses to fetch.
     */
    orderBy?: SuperAdminAccessOrderByWithRelationInput | SuperAdminAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SuperAdminAccesses.
     */
    cursor?: SuperAdminAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdminAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdminAccesses.
     */
    skip?: number
    distinct?: SuperAdminAccessScalarFieldEnum | SuperAdminAccessScalarFieldEnum[]
  }

  /**
   * SuperAdminAccess create
   */
  export type SuperAdminAccessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * The data needed to create a SuperAdminAccess.
     */
    data: XOR<SuperAdminAccessCreateInput, SuperAdminAccessUncheckedCreateInput>
  }

  /**
   * SuperAdminAccess createMany
   */
  export type SuperAdminAccessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuperAdminAccesses.
     */
    data: SuperAdminAccessCreateManyInput | SuperAdminAccessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdminAccess update
   */
  export type SuperAdminAccessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * The data needed to update a SuperAdminAccess.
     */
    data: XOR<SuperAdminAccessUpdateInput, SuperAdminAccessUncheckedUpdateInput>
    /**
     * Choose, which SuperAdminAccess to update.
     */
    where: SuperAdminAccessWhereUniqueInput
  }

  /**
   * SuperAdminAccess updateMany
   */
  export type SuperAdminAccessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuperAdminAccesses.
     */
    data: XOR<SuperAdminAccessUpdateManyMutationInput, SuperAdminAccessUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdminAccesses to update
     */
    where?: SuperAdminAccessWhereInput
    /**
     * Limit how many SuperAdminAccesses to update.
     */
    limit?: number
  }

  /**
   * SuperAdminAccess upsert
   */
  export type SuperAdminAccessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * The filter to search for the SuperAdminAccess to update in case it exists.
     */
    where: SuperAdminAccessWhereUniqueInput
    /**
     * In case the SuperAdminAccess found by the `where` argument doesn't exist, create a new SuperAdminAccess with this data.
     */
    create: XOR<SuperAdminAccessCreateInput, SuperAdminAccessUncheckedCreateInput>
    /**
     * In case the SuperAdminAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuperAdminAccessUpdateInput, SuperAdminAccessUncheckedUpdateInput>
  }

  /**
   * SuperAdminAccess delete
   */
  export type SuperAdminAccessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
    /**
     * Filter which SuperAdminAccess to delete.
     */
    where: SuperAdminAccessWhereUniqueInput
  }

  /**
   * SuperAdminAccess deleteMany
   */
  export type SuperAdminAccessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdminAccesses to delete
     */
    where?: SuperAdminAccessWhereInput
    /**
     * Limit how many SuperAdminAccesses to delete.
     */
    limit?: number
  }

  /**
   * SuperAdminAccess without action
   */
  export type SuperAdminAccessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminAccess
     */
    select?: SuperAdminAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdminAccess
     */
    omit?: SuperAdminAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminAccessInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PlanScalarFieldEnum: {
    id: 'id',
    name: 'name',
    price: 'price',
    period: 'period',
    description: 'description',
    status: 'status',
    maxBarbers: 'maxBarbers',
    maxServices: 'maxServices',
    maxServiceOptions: 'maxServiceOptions',
    maxBookingsPerMonth: 'maxBookingsPerMonth',
    maxBarberShops: 'maxBarberShops',
    maxStorageMB: 'maxStorageMB',
    hasAnalytics: 'hasAnalytics',
    hasNotifications: 'hasNotifications',
    hasCustomDomain: 'hasCustomDomain',
    hasWhiteLabel: 'hasWhiteLabel',
    hasAPI: 'hasAPI',
    hasPrioritySupport: 'hasPrioritySupport',
    features: 'features',
    trialDays: 'trialDays',
    requiresCard: 'requiresCard',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    subdomain: 'subdomain',
    customDomain: 'customDomain',
    ownerName: 'ownerName',
    ownerEmail: 'ownerEmail',
    ownerPhone: 'ownerPhone',
    databaseName: 'databaseName',
    databaseUrl: 'databaseUrl',
    status: 'status',
    isActive: 'isActive',
    planId: 'planId',
    trialStartDate: 'trialStartDate',
    trialEndDate: 'trialEndDate',
    trialUsed: 'trialUsed',
    asaasCustomerId: 'asaasCustomerId',
    asaasSubscriptionId: 'asaasSubscriptionId',
    currentBarbers: 'currentBarbers',
    currentServices: 'currentServices',
    currentBookingsThisMonth: 'currentBookingsThisMonth',
    currentBarberShops: 'currentBarberShops',
    currentStorageMB: 'currentStorageMB',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    planId: 'planId',
    status: 'status',
    isActive: 'isActive',
    startDate: 'startDate',
    endDate: 'endDate',
    cancelledAt: 'cancelledAt',
    asaasSubscriptionId: 'asaasSubscriptionId',
    paymentMethod: 'paymentMethod',
    amount: 'amount',
    autoRenew: 'autoRenew',
    nextBillingDate: 'nextBillingDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const PromotionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    description: 'description',
    code: 'code',
    discountType: 'discountType',
    discountValue: 'discountValue',
    maxUses: 'maxUses',
    currentUses: 'currentUses',
    validFrom: 'validFrom',
    validUntil: 'validUntil',
    planIds: 'planIds',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PromotionScalarFieldEnum = (typeof PromotionScalarFieldEnum)[keyof typeof PromotionScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    senderId: 'senderId',
    senderName: 'senderName',
    senderType: 'senderType',
    message: 'message',
    isRead: 'isRead',
    readAt: 'readAt',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const LandingPageImageScalarFieldEnum: {
    id: 'id',
    section: 'section',
    position: 'position',
    imageUrl: 'imageUrl',
    altText: 'altText',
    order: 'order',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LandingPageImageScalarFieldEnum = (typeof LandingPageImageScalarFieldEnum)[keyof typeof LandingPageImageScalarFieldEnum]


  export const LandingPageConfigScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LandingPageConfigScalarFieldEnum = (typeof LandingPageConfigScalarFieldEnum)[keyof typeof LandingPageConfigScalarFieldEnum]


  export const ReportScalarFieldEnum: {
    id: 'id',
    type: 'type',
    period: 'period',
    data: 'data',
    generatedAt: 'generatedAt',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd'
  };

  export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum]


  export const ExpirationNotificationScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    type: 'type',
    daysLeft: 'daysLeft',
    sentAt: 'sentAt',
    emailSent: 'emailSent'
  };

  export type ExpirationNotificationScalarFieldEnum = (typeof ExpirationNotificationScalarFieldEnum)[keyof typeof ExpirationNotificationScalarFieldEnum]


  export const SuperAdminAccessScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    adminEmail: 'adminEmail',
    accessToken: 'accessToken',
    lastAccessed: 'lastAccessed',
    accessLogs: 'accessLogs',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SuperAdminAccessScalarFieldEnum = (typeof SuperAdminAccessScalarFieldEnum)[keyof typeof SuperAdminAccessScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const PlanOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    period: 'period',
    description: 'description'
  };

  export type PlanOrderByRelevanceFieldEnum = (typeof PlanOrderByRelevanceFieldEnum)[keyof typeof PlanOrderByRelevanceFieldEnum]


  export const TenantOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    subdomain: 'subdomain',
    customDomain: 'customDomain',
    ownerName: 'ownerName',
    ownerEmail: 'ownerEmail',
    ownerPhone: 'ownerPhone',
    databaseName: 'databaseName',
    databaseUrl: 'databaseUrl',
    status: 'status',
    planId: 'planId',
    asaasCustomerId: 'asaasCustomerId',
    asaasSubscriptionId: 'asaasSubscriptionId'
  };

  export type TenantOrderByRelevanceFieldEnum = (typeof TenantOrderByRelevanceFieldEnum)[keyof typeof TenantOrderByRelevanceFieldEnum]


  export const SubscriptionOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    planId: 'planId',
    status: 'status',
    asaasSubscriptionId: 'asaasSubscriptionId',
    paymentMethod: 'paymentMethod'
  };

  export type SubscriptionOrderByRelevanceFieldEnum = (typeof SubscriptionOrderByRelevanceFieldEnum)[keyof typeof SubscriptionOrderByRelevanceFieldEnum]


  export const PromotionOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    description: 'description',
    code: 'code',
    discountType: 'discountType'
  };

  export type PromotionOrderByRelevanceFieldEnum = (typeof PromotionOrderByRelevanceFieldEnum)[keyof typeof PromotionOrderByRelevanceFieldEnum]


  export const ChatMessageOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    senderId: 'senderId',
    senderName: 'senderName',
    senderType: 'senderType',
    message: 'message'
  };

  export type ChatMessageOrderByRelevanceFieldEnum = (typeof ChatMessageOrderByRelevanceFieldEnum)[keyof typeof ChatMessageOrderByRelevanceFieldEnum]


  export const LandingPageImageOrderByRelevanceFieldEnum: {
    id: 'id',
    section: 'section',
    position: 'position',
    imageUrl: 'imageUrl',
    altText: 'altText'
  };

  export type LandingPageImageOrderByRelevanceFieldEnum = (typeof LandingPageImageOrderByRelevanceFieldEnum)[keyof typeof LandingPageImageOrderByRelevanceFieldEnum]


  export const LandingPageConfigOrderByRelevanceFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    type: 'type'
  };

  export type LandingPageConfigOrderByRelevanceFieldEnum = (typeof LandingPageConfigOrderByRelevanceFieldEnum)[keyof typeof LandingPageConfigOrderByRelevanceFieldEnum]


  export const ReportOrderByRelevanceFieldEnum: {
    id: 'id',
    type: 'type',
    period: 'period'
  };

  export type ReportOrderByRelevanceFieldEnum = (typeof ReportOrderByRelevanceFieldEnum)[keyof typeof ReportOrderByRelevanceFieldEnum]


  export const ExpirationNotificationOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    type: 'type'
  };

  export type ExpirationNotificationOrderByRelevanceFieldEnum = (typeof ExpirationNotificationOrderByRelevanceFieldEnum)[keyof typeof ExpirationNotificationOrderByRelevanceFieldEnum]


  export const SuperAdminAccessOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    adminEmail: 'adminEmail',
    accessToken: 'accessToken'
  };

  export type SuperAdminAccessOrderByRelevanceFieldEnum = (typeof SuperAdminAccessOrderByRelevanceFieldEnum)[keyof typeof SuperAdminAccessOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type PlanWhereInput = {
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    id?: StringFilter<"Plan"> | string
    name?: StringFilter<"Plan"> | string
    price?: DecimalFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    period?: StringFilter<"Plan"> | string
    description?: StringNullableFilter<"Plan"> | string | null
    status?: BoolFilter<"Plan"> | boolean
    maxBarbers?: IntFilter<"Plan"> | number
    maxServices?: IntFilter<"Plan"> | number
    maxServiceOptions?: IntFilter<"Plan"> | number
    maxBookingsPerMonth?: IntFilter<"Plan"> | number
    maxBarberShops?: IntFilter<"Plan"> | number
    maxStorageMB?: IntFilter<"Plan"> | number
    hasAnalytics?: BoolFilter<"Plan"> | boolean
    hasNotifications?: BoolFilter<"Plan"> | boolean
    hasCustomDomain?: BoolFilter<"Plan"> | boolean
    hasWhiteLabel?: BoolFilter<"Plan"> | boolean
    hasAPI?: BoolFilter<"Plan"> | boolean
    hasPrioritySupport?: BoolFilter<"Plan"> | boolean
    features?: JsonNullableFilter<"Plan">
    trialDays?: IntFilter<"Plan"> | number
    requiresCard?: BoolFilter<"Plan"> | boolean
    createdAt?: DateTimeFilter<"Plan"> | Date | string
    updatedAt?: DateTimeFilter<"Plan"> | Date | string
    subscriptions?: SubscriptionListRelationFilter
    tenants?: TenantListRelationFilter
  }

  export type PlanOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    period?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    maxBarbers?: SortOrder
    maxServices?: SortOrder
    maxServiceOptions?: SortOrder
    maxBookingsPerMonth?: SortOrder
    maxBarberShops?: SortOrder
    maxStorageMB?: SortOrder
    hasAnalytics?: SortOrder
    hasNotifications?: SortOrder
    hasCustomDomain?: SortOrder
    hasWhiteLabel?: SortOrder
    hasAPI?: SortOrder
    hasPrioritySupport?: SortOrder
    features?: SortOrderInput | SortOrder
    trialDays?: SortOrder
    requiresCard?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    tenants?: TenantOrderByRelationAggregateInput
    _relevance?: PlanOrderByRelevanceInput
  }

  export type PlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    name?: StringFilter<"Plan"> | string
    price?: DecimalFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    period?: StringFilter<"Plan"> | string
    description?: StringNullableFilter<"Plan"> | string | null
    status?: BoolFilter<"Plan"> | boolean
    maxBarbers?: IntFilter<"Plan"> | number
    maxServices?: IntFilter<"Plan"> | number
    maxServiceOptions?: IntFilter<"Plan"> | number
    maxBookingsPerMonth?: IntFilter<"Plan"> | number
    maxBarberShops?: IntFilter<"Plan"> | number
    maxStorageMB?: IntFilter<"Plan"> | number
    hasAnalytics?: BoolFilter<"Plan"> | boolean
    hasNotifications?: BoolFilter<"Plan"> | boolean
    hasCustomDomain?: BoolFilter<"Plan"> | boolean
    hasWhiteLabel?: BoolFilter<"Plan"> | boolean
    hasAPI?: BoolFilter<"Plan"> | boolean
    hasPrioritySupport?: BoolFilter<"Plan"> | boolean
    features?: JsonNullableFilter<"Plan">
    trialDays?: IntFilter<"Plan"> | number
    requiresCard?: BoolFilter<"Plan"> | boolean
    createdAt?: DateTimeFilter<"Plan"> | Date | string
    updatedAt?: DateTimeFilter<"Plan"> | Date | string
    subscriptions?: SubscriptionListRelationFilter
    tenants?: TenantListRelationFilter
  }, "id">

  export type PlanOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    period?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    maxBarbers?: SortOrder
    maxServices?: SortOrder
    maxServiceOptions?: SortOrder
    maxBookingsPerMonth?: SortOrder
    maxBarberShops?: SortOrder
    maxStorageMB?: SortOrder
    hasAnalytics?: SortOrder
    hasNotifications?: SortOrder
    hasCustomDomain?: SortOrder
    hasWhiteLabel?: SortOrder
    hasAPI?: SortOrder
    hasPrioritySupport?: SortOrder
    features?: SortOrderInput | SortOrder
    trialDays?: SortOrder
    requiresCard?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlanCountOrderByAggregateInput
    _avg?: PlanAvgOrderByAggregateInput
    _max?: PlanMaxOrderByAggregateInput
    _min?: PlanMinOrderByAggregateInput
    _sum?: PlanSumOrderByAggregateInput
  }

  export type PlanScalarWhereWithAggregatesInput = {
    AND?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    OR?: PlanScalarWhereWithAggregatesInput[]
    NOT?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Plan"> | string
    name?: StringWithAggregatesFilter<"Plan"> | string
    price?: DecimalWithAggregatesFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    period?: StringWithAggregatesFilter<"Plan"> | string
    description?: StringNullableWithAggregatesFilter<"Plan"> | string | null
    status?: BoolWithAggregatesFilter<"Plan"> | boolean
    maxBarbers?: IntWithAggregatesFilter<"Plan"> | number
    maxServices?: IntWithAggregatesFilter<"Plan"> | number
    maxServiceOptions?: IntWithAggregatesFilter<"Plan"> | number
    maxBookingsPerMonth?: IntWithAggregatesFilter<"Plan"> | number
    maxBarberShops?: IntWithAggregatesFilter<"Plan"> | number
    maxStorageMB?: IntWithAggregatesFilter<"Plan"> | number
    hasAnalytics?: BoolWithAggregatesFilter<"Plan"> | boolean
    hasNotifications?: BoolWithAggregatesFilter<"Plan"> | boolean
    hasCustomDomain?: BoolWithAggregatesFilter<"Plan"> | boolean
    hasWhiteLabel?: BoolWithAggregatesFilter<"Plan"> | boolean
    hasAPI?: BoolWithAggregatesFilter<"Plan"> | boolean
    hasPrioritySupport?: BoolWithAggregatesFilter<"Plan"> | boolean
    features?: JsonNullableWithAggregatesFilter<"Plan">
    trialDays?: IntWithAggregatesFilter<"Plan"> | number
    requiresCard?: BoolWithAggregatesFilter<"Plan"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Plan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Plan"> | Date | string
  }

  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    subdomain?: StringFilter<"Tenant"> | string
    customDomain?: StringNullableFilter<"Tenant"> | string | null
    ownerName?: StringFilter<"Tenant"> | string
    ownerEmail?: StringFilter<"Tenant"> | string
    ownerPhone?: StringNullableFilter<"Tenant"> | string | null
    databaseName?: StringFilter<"Tenant"> | string
    databaseUrl?: StringFilter<"Tenant"> | string
    status?: StringFilter<"Tenant"> | string
    isActive?: BoolFilter<"Tenant"> | boolean
    planId?: StringNullableFilter<"Tenant"> | string | null
    trialStartDate?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    trialEndDate?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    trialUsed?: BoolFilter<"Tenant"> | boolean
    asaasCustomerId?: StringNullableFilter<"Tenant"> | string | null
    asaasSubscriptionId?: StringNullableFilter<"Tenant"> | string | null
    currentBarbers?: IntFilter<"Tenant"> | number
    currentServices?: IntFilter<"Tenant"> | number
    currentBookingsThisMonth?: IntFilter<"Tenant"> | number
    currentBarberShops?: IntFilter<"Tenant"> | number
    currentStorageMB?: IntFilter<"Tenant"> | number
    metadata?: JsonNullableFilter<"Tenant">
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    plan?: XOR<PlanNullableScalarRelationFilter, PlanWhereInput> | null
    subscriptions?: SubscriptionListRelationFilter
    chatMessages?: ChatMessageListRelationFilter
    promotions?: PromotionListRelationFilter
    expirationNotifications?: ExpirationNotificationListRelationFilter
    superAdminAccess?: XOR<SuperAdminAccessNullableScalarRelationFilter, SuperAdminAccessWhereInput> | null
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrderInput | SortOrder
    ownerName?: SortOrder
    ownerEmail?: SortOrder
    ownerPhone?: SortOrderInput | SortOrder
    databaseName?: SortOrder
    databaseUrl?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    planId?: SortOrderInput | SortOrder
    trialStartDate?: SortOrderInput | SortOrder
    trialEndDate?: SortOrderInput | SortOrder
    trialUsed?: SortOrder
    asaasCustomerId?: SortOrderInput | SortOrder
    asaasSubscriptionId?: SortOrderInput | SortOrder
    currentBarbers?: SortOrder
    currentServices?: SortOrder
    currentBookingsThisMonth?: SortOrder
    currentBarberShops?: SortOrder
    currentStorageMB?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    plan?: PlanOrderByWithRelationInput
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    chatMessages?: ChatMessageOrderByRelationAggregateInput
    promotions?: PromotionOrderByRelationAggregateInput
    expirationNotifications?: ExpirationNotificationOrderByRelationAggregateInput
    superAdminAccess?: SuperAdminAccessOrderByWithRelationInput
    _relevance?: TenantOrderByRelevanceInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    subdomain?: string
    customDomain?: string
    databaseName?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    ownerName?: StringFilter<"Tenant"> | string
    ownerEmail?: StringFilter<"Tenant"> | string
    ownerPhone?: StringNullableFilter<"Tenant"> | string | null
    databaseUrl?: StringFilter<"Tenant"> | string
    status?: StringFilter<"Tenant"> | string
    isActive?: BoolFilter<"Tenant"> | boolean
    planId?: StringNullableFilter<"Tenant"> | string | null
    trialStartDate?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    trialEndDate?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    trialUsed?: BoolFilter<"Tenant"> | boolean
    asaasCustomerId?: StringNullableFilter<"Tenant"> | string | null
    asaasSubscriptionId?: StringNullableFilter<"Tenant"> | string | null
    currentBarbers?: IntFilter<"Tenant"> | number
    currentServices?: IntFilter<"Tenant"> | number
    currentBookingsThisMonth?: IntFilter<"Tenant"> | number
    currentBarberShops?: IntFilter<"Tenant"> | number
    currentStorageMB?: IntFilter<"Tenant"> | number
    metadata?: JsonNullableFilter<"Tenant">
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    plan?: XOR<PlanNullableScalarRelationFilter, PlanWhereInput> | null
    subscriptions?: SubscriptionListRelationFilter
    chatMessages?: ChatMessageListRelationFilter
    promotions?: PromotionListRelationFilter
    expirationNotifications?: ExpirationNotificationListRelationFilter
    superAdminAccess?: XOR<SuperAdminAccessNullableScalarRelationFilter, SuperAdminAccessWhereInput> | null
  }, "id" | "subdomain" | "customDomain" | "databaseName">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrderInput | SortOrder
    ownerName?: SortOrder
    ownerEmail?: SortOrder
    ownerPhone?: SortOrderInput | SortOrder
    databaseName?: SortOrder
    databaseUrl?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    planId?: SortOrderInput | SortOrder
    trialStartDate?: SortOrderInput | SortOrder
    trialEndDate?: SortOrderInput | SortOrder
    trialUsed?: SortOrder
    asaasCustomerId?: SortOrderInput | SortOrder
    asaasSubscriptionId?: SortOrderInput | SortOrder
    currentBarbers?: SortOrder
    currentServices?: SortOrder
    currentBookingsThisMonth?: SortOrder
    currentBarberShops?: SortOrder
    currentStorageMB?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    name?: StringWithAggregatesFilter<"Tenant"> | string
    subdomain?: StringWithAggregatesFilter<"Tenant"> | string
    customDomain?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    ownerName?: StringWithAggregatesFilter<"Tenant"> | string
    ownerEmail?: StringWithAggregatesFilter<"Tenant"> | string
    ownerPhone?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    databaseName?: StringWithAggregatesFilter<"Tenant"> | string
    databaseUrl?: StringWithAggregatesFilter<"Tenant"> | string
    status?: StringWithAggregatesFilter<"Tenant"> | string
    isActive?: BoolWithAggregatesFilter<"Tenant"> | boolean
    planId?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    trialStartDate?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    trialEndDate?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    trialUsed?: BoolWithAggregatesFilter<"Tenant"> | boolean
    asaasCustomerId?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    asaasSubscriptionId?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    currentBarbers?: IntWithAggregatesFilter<"Tenant"> | number
    currentServices?: IntWithAggregatesFilter<"Tenant"> | number
    currentBookingsThisMonth?: IntWithAggregatesFilter<"Tenant"> | number
    currentBarberShops?: IntWithAggregatesFilter<"Tenant"> | number
    currentStorageMB?: IntWithAggregatesFilter<"Tenant"> | number
    metadata?: JsonNullableWithAggregatesFilter<"Tenant">
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    tenantId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    isActive?: BoolFilter<"Subscription"> | boolean
    startDate?: DateTimeFilter<"Subscription"> | Date | string
    endDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    asaasSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    paymentMethod?: StringNullableFilter<"Subscription"> | string | null
    amount?: DecimalNullableFilter<"Subscription"> | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFilter<"Subscription"> | boolean
    nextBillingDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    plan?: XOR<PlanScalarRelationFilter, PlanWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    asaasSubscriptionId?: SortOrderInput | SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    autoRenew?: SortOrder
    nextBillingDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    plan?: PlanOrderByWithRelationInput
    _relevance?: SubscriptionOrderByRelevanceInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    tenantId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    isActive?: BoolFilter<"Subscription"> | boolean
    startDate?: DateTimeFilter<"Subscription"> | Date | string
    endDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    asaasSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    paymentMethod?: StringNullableFilter<"Subscription"> | string | null
    amount?: DecimalNullableFilter<"Subscription"> | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFilter<"Subscription"> | boolean
    nextBillingDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    plan?: XOR<PlanScalarRelationFilter, PlanWhereInput>
  }, "id">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    asaasSubscriptionId?: SortOrderInput | SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    autoRenew?: SortOrder
    nextBillingDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _avg?: SubscriptionAvgOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
    _sum?: SubscriptionSumOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    tenantId?: StringWithAggregatesFilter<"Subscription"> | string
    planId?: StringWithAggregatesFilter<"Subscription"> | string
    status?: StringWithAggregatesFilter<"Subscription"> | string
    isActive?: BoolWithAggregatesFilter<"Subscription"> | boolean
    startDate?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    cancelledAt?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    asaasSubscriptionId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    paymentMethod?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    amount?: DecimalNullableWithAggregatesFilter<"Subscription"> | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolWithAggregatesFilter<"Subscription"> | boolean
    nextBillingDate?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type PromotionWhereInput = {
    AND?: PromotionWhereInput | PromotionWhereInput[]
    OR?: PromotionWhereInput[]
    NOT?: PromotionWhereInput | PromotionWhereInput[]
    id?: StringFilter<"Promotion"> | string
    tenantId?: StringNullableFilter<"Promotion"> | string | null
    name?: StringFilter<"Promotion"> | string
    description?: StringNullableFilter<"Promotion"> | string | null
    code?: StringFilter<"Promotion"> | string
    discountType?: StringFilter<"Promotion"> | string
    discountValue?: DecimalFilter<"Promotion"> | Decimal | DecimalJsLike | number | string
    maxUses?: IntNullableFilter<"Promotion"> | number | null
    currentUses?: IntFilter<"Promotion"> | number
    validFrom?: DateTimeFilter<"Promotion"> | Date | string
    validUntil?: DateTimeNullableFilter<"Promotion"> | Date | string | null
    planIds?: JsonNullableFilter<"Promotion">
    status?: BoolFilter<"Promotion"> | boolean
    createdAt?: DateTimeFilter<"Promotion"> | Date | string
    updatedAt?: DateTimeFilter<"Promotion"> | Date | string
    tenant?: XOR<TenantNullableScalarRelationFilter, TenantWhereInput> | null
  }

  export type PromotionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    code?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxUses?: SortOrderInput | SortOrder
    currentUses?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrderInput | SortOrder
    planIds?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: PromotionOrderByRelevanceInput
  }

  export type PromotionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: PromotionWhereInput | PromotionWhereInput[]
    OR?: PromotionWhereInput[]
    NOT?: PromotionWhereInput | PromotionWhereInput[]
    tenantId?: StringNullableFilter<"Promotion"> | string | null
    name?: StringFilter<"Promotion"> | string
    description?: StringNullableFilter<"Promotion"> | string | null
    discountType?: StringFilter<"Promotion"> | string
    discountValue?: DecimalFilter<"Promotion"> | Decimal | DecimalJsLike | number | string
    maxUses?: IntNullableFilter<"Promotion"> | number | null
    currentUses?: IntFilter<"Promotion"> | number
    validFrom?: DateTimeFilter<"Promotion"> | Date | string
    validUntil?: DateTimeNullableFilter<"Promotion"> | Date | string | null
    planIds?: JsonNullableFilter<"Promotion">
    status?: BoolFilter<"Promotion"> | boolean
    createdAt?: DateTimeFilter<"Promotion"> | Date | string
    updatedAt?: DateTimeFilter<"Promotion"> | Date | string
    tenant?: XOR<TenantNullableScalarRelationFilter, TenantWhereInput> | null
  }, "id" | "code">

  export type PromotionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    code?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxUses?: SortOrderInput | SortOrder
    currentUses?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrderInput | SortOrder
    planIds?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PromotionCountOrderByAggregateInput
    _avg?: PromotionAvgOrderByAggregateInput
    _max?: PromotionMaxOrderByAggregateInput
    _min?: PromotionMinOrderByAggregateInput
    _sum?: PromotionSumOrderByAggregateInput
  }

  export type PromotionScalarWhereWithAggregatesInput = {
    AND?: PromotionScalarWhereWithAggregatesInput | PromotionScalarWhereWithAggregatesInput[]
    OR?: PromotionScalarWhereWithAggregatesInput[]
    NOT?: PromotionScalarWhereWithAggregatesInput | PromotionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Promotion"> | string
    tenantId?: StringNullableWithAggregatesFilter<"Promotion"> | string | null
    name?: StringWithAggregatesFilter<"Promotion"> | string
    description?: StringNullableWithAggregatesFilter<"Promotion"> | string | null
    code?: StringWithAggregatesFilter<"Promotion"> | string
    discountType?: StringWithAggregatesFilter<"Promotion"> | string
    discountValue?: DecimalWithAggregatesFilter<"Promotion"> | Decimal | DecimalJsLike | number | string
    maxUses?: IntNullableWithAggregatesFilter<"Promotion"> | number | null
    currentUses?: IntWithAggregatesFilter<"Promotion"> | number
    validFrom?: DateTimeWithAggregatesFilter<"Promotion"> | Date | string
    validUntil?: DateTimeNullableWithAggregatesFilter<"Promotion"> | Date | string | null
    planIds?: JsonNullableWithAggregatesFilter<"Promotion">
    status?: BoolWithAggregatesFilter<"Promotion"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Promotion"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Promotion"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    tenantId?: StringNullableFilter<"ChatMessage"> | string | null
    senderId?: StringFilter<"ChatMessage"> | string
    senderName?: StringFilter<"ChatMessage"> | string
    senderType?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    isRead?: BoolFilter<"ChatMessage"> | boolean
    readAt?: DateTimeNullableFilter<"ChatMessage"> | Date | string | null
    metadata?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    tenant?: XOR<TenantNullableScalarRelationFilter, TenantWhereInput> | null
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    senderType?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: ChatMessageOrderByRelevanceInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    tenantId?: StringNullableFilter<"ChatMessage"> | string | null
    senderId?: StringFilter<"ChatMessage"> | string
    senderName?: StringFilter<"ChatMessage"> | string
    senderType?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    isRead?: BoolFilter<"ChatMessage"> | boolean
    readAt?: DateTimeNullableFilter<"ChatMessage"> | Date | string | null
    metadata?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    tenant?: XOR<TenantNullableScalarRelationFilter, TenantWhereInput> | null
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    senderType?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    tenantId?: StringNullableWithAggregatesFilter<"ChatMessage"> | string | null
    senderId?: StringWithAggregatesFilter<"ChatMessage"> | string
    senderName?: StringWithAggregatesFilter<"ChatMessage"> | string
    senderType?: StringWithAggregatesFilter<"ChatMessage"> | string
    message?: StringWithAggregatesFilter<"ChatMessage"> | string
    isRead?: BoolWithAggregatesFilter<"ChatMessage"> | boolean
    readAt?: DateTimeNullableWithAggregatesFilter<"ChatMessage"> | Date | string | null
    metadata?: JsonNullableWithAggregatesFilter<"ChatMessage">
    createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type LandingPageImageWhereInput = {
    AND?: LandingPageImageWhereInput | LandingPageImageWhereInput[]
    OR?: LandingPageImageWhereInput[]
    NOT?: LandingPageImageWhereInput | LandingPageImageWhereInput[]
    id?: StringFilter<"LandingPageImage"> | string
    section?: StringFilter<"LandingPageImage"> | string
    position?: StringFilter<"LandingPageImage"> | string
    imageUrl?: StringFilter<"LandingPageImage"> | string
    altText?: StringNullableFilter<"LandingPageImage"> | string | null
    order?: IntFilter<"LandingPageImage"> | number
    status?: BoolFilter<"LandingPageImage"> | boolean
    createdAt?: DateTimeFilter<"LandingPageImage"> | Date | string
    updatedAt?: DateTimeFilter<"LandingPageImage"> | Date | string
  }

  export type LandingPageImageOrderByWithRelationInput = {
    id?: SortOrder
    section?: SortOrder
    position?: SortOrder
    imageUrl?: SortOrder
    altText?: SortOrderInput | SortOrder
    order?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: LandingPageImageOrderByRelevanceInput
  }

  export type LandingPageImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    section_position?: LandingPageImageSectionPositionCompoundUniqueInput
    AND?: LandingPageImageWhereInput | LandingPageImageWhereInput[]
    OR?: LandingPageImageWhereInput[]
    NOT?: LandingPageImageWhereInput | LandingPageImageWhereInput[]
    section?: StringFilter<"LandingPageImage"> | string
    position?: StringFilter<"LandingPageImage"> | string
    imageUrl?: StringFilter<"LandingPageImage"> | string
    altText?: StringNullableFilter<"LandingPageImage"> | string | null
    order?: IntFilter<"LandingPageImage"> | number
    status?: BoolFilter<"LandingPageImage"> | boolean
    createdAt?: DateTimeFilter<"LandingPageImage"> | Date | string
    updatedAt?: DateTimeFilter<"LandingPageImage"> | Date | string
  }, "id" | "section_position">

  export type LandingPageImageOrderByWithAggregationInput = {
    id?: SortOrder
    section?: SortOrder
    position?: SortOrder
    imageUrl?: SortOrder
    altText?: SortOrderInput | SortOrder
    order?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LandingPageImageCountOrderByAggregateInput
    _avg?: LandingPageImageAvgOrderByAggregateInput
    _max?: LandingPageImageMaxOrderByAggregateInput
    _min?: LandingPageImageMinOrderByAggregateInput
    _sum?: LandingPageImageSumOrderByAggregateInput
  }

  export type LandingPageImageScalarWhereWithAggregatesInput = {
    AND?: LandingPageImageScalarWhereWithAggregatesInput | LandingPageImageScalarWhereWithAggregatesInput[]
    OR?: LandingPageImageScalarWhereWithAggregatesInput[]
    NOT?: LandingPageImageScalarWhereWithAggregatesInput | LandingPageImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LandingPageImage"> | string
    section?: StringWithAggregatesFilter<"LandingPageImage"> | string
    position?: StringWithAggregatesFilter<"LandingPageImage"> | string
    imageUrl?: StringWithAggregatesFilter<"LandingPageImage"> | string
    altText?: StringNullableWithAggregatesFilter<"LandingPageImage"> | string | null
    order?: IntWithAggregatesFilter<"LandingPageImage"> | number
    status?: BoolWithAggregatesFilter<"LandingPageImage"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"LandingPageImage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LandingPageImage"> | Date | string
  }

  export type LandingPageConfigWhereInput = {
    AND?: LandingPageConfigWhereInput | LandingPageConfigWhereInput[]
    OR?: LandingPageConfigWhereInput[]
    NOT?: LandingPageConfigWhereInput | LandingPageConfigWhereInput[]
    id?: StringFilter<"LandingPageConfig"> | string
    key?: StringFilter<"LandingPageConfig"> | string
    value?: StringFilter<"LandingPageConfig"> | string
    type?: StringFilter<"LandingPageConfig"> | string
    createdAt?: DateTimeFilter<"LandingPageConfig"> | Date | string
    updatedAt?: DateTimeFilter<"LandingPageConfig"> | Date | string
  }

  export type LandingPageConfigOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: LandingPageConfigOrderByRelevanceInput
  }

  export type LandingPageConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: LandingPageConfigWhereInput | LandingPageConfigWhereInput[]
    OR?: LandingPageConfigWhereInput[]
    NOT?: LandingPageConfigWhereInput | LandingPageConfigWhereInput[]
    value?: StringFilter<"LandingPageConfig"> | string
    type?: StringFilter<"LandingPageConfig"> | string
    createdAt?: DateTimeFilter<"LandingPageConfig"> | Date | string
    updatedAt?: DateTimeFilter<"LandingPageConfig"> | Date | string
  }, "id" | "key">

  export type LandingPageConfigOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LandingPageConfigCountOrderByAggregateInput
    _max?: LandingPageConfigMaxOrderByAggregateInput
    _min?: LandingPageConfigMinOrderByAggregateInput
  }

  export type LandingPageConfigScalarWhereWithAggregatesInput = {
    AND?: LandingPageConfigScalarWhereWithAggregatesInput | LandingPageConfigScalarWhereWithAggregatesInput[]
    OR?: LandingPageConfigScalarWhereWithAggregatesInput[]
    NOT?: LandingPageConfigScalarWhereWithAggregatesInput | LandingPageConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LandingPageConfig"> | string
    key?: StringWithAggregatesFilter<"LandingPageConfig"> | string
    value?: StringWithAggregatesFilter<"LandingPageConfig"> | string
    type?: StringWithAggregatesFilter<"LandingPageConfig"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LandingPageConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LandingPageConfig"> | Date | string
  }

  export type ReportWhereInput = {
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    id?: StringFilter<"Report"> | string
    type?: StringFilter<"Report"> | string
    period?: StringFilter<"Report"> | string
    data?: JsonFilter<"Report">
    generatedAt?: DateTimeFilter<"Report"> | Date | string
    periodStart?: DateTimeFilter<"Report"> | Date | string
    periodEnd?: DateTimeFilter<"Report"> | Date | string
  }

  export type ReportOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    data?: SortOrder
    generatedAt?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    _relevance?: ReportOrderByRelevanceInput
  }

  export type ReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    type?: StringFilter<"Report"> | string
    period?: StringFilter<"Report"> | string
    data?: JsonFilter<"Report">
    generatedAt?: DateTimeFilter<"Report"> | Date | string
    periodStart?: DateTimeFilter<"Report"> | Date | string
    periodEnd?: DateTimeFilter<"Report"> | Date | string
  }, "id">

  export type ReportOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    data?: SortOrder
    generatedAt?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    _count?: ReportCountOrderByAggregateInput
    _max?: ReportMaxOrderByAggregateInput
    _min?: ReportMinOrderByAggregateInput
  }

  export type ReportScalarWhereWithAggregatesInput = {
    AND?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    OR?: ReportScalarWhereWithAggregatesInput[]
    NOT?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Report"> | string
    type?: StringWithAggregatesFilter<"Report"> | string
    period?: StringWithAggregatesFilter<"Report"> | string
    data?: JsonWithAggregatesFilter<"Report">
    generatedAt?: DateTimeWithAggregatesFilter<"Report"> | Date | string
    periodStart?: DateTimeWithAggregatesFilter<"Report"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"Report"> | Date | string
  }

  export type ExpirationNotificationWhereInput = {
    AND?: ExpirationNotificationWhereInput | ExpirationNotificationWhereInput[]
    OR?: ExpirationNotificationWhereInput[]
    NOT?: ExpirationNotificationWhereInput | ExpirationNotificationWhereInput[]
    id?: StringFilter<"ExpirationNotification"> | string
    tenantId?: StringFilter<"ExpirationNotification"> | string
    type?: StringFilter<"ExpirationNotification"> | string
    daysLeft?: IntNullableFilter<"ExpirationNotification"> | number | null
    sentAt?: DateTimeFilter<"ExpirationNotification"> | Date | string
    emailSent?: BoolFilter<"ExpirationNotification"> | boolean
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type ExpirationNotificationOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    type?: SortOrder
    daysLeft?: SortOrderInput | SortOrder
    sentAt?: SortOrder
    emailSent?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: ExpirationNotificationOrderByRelevanceInput
  }

  export type ExpirationNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExpirationNotificationWhereInput | ExpirationNotificationWhereInput[]
    OR?: ExpirationNotificationWhereInput[]
    NOT?: ExpirationNotificationWhereInput | ExpirationNotificationWhereInput[]
    tenantId?: StringFilter<"ExpirationNotification"> | string
    type?: StringFilter<"ExpirationNotification"> | string
    daysLeft?: IntNullableFilter<"ExpirationNotification"> | number | null
    sentAt?: DateTimeFilter<"ExpirationNotification"> | Date | string
    emailSent?: BoolFilter<"ExpirationNotification"> | boolean
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type ExpirationNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    type?: SortOrder
    daysLeft?: SortOrderInput | SortOrder
    sentAt?: SortOrder
    emailSent?: SortOrder
    _count?: ExpirationNotificationCountOrderByAggregateInput
    _avg?: ExpirationNotificationAvgOrderByAggregateInput
    _max?: ExpirationNotificationMaxOrderByAggregateInput
    _min?: ExpirationNotificationMinOrderByAggregateInput
    _sum?: ExpirationNotificationSumOrderByAggregateInput
  }

  export type ExpirationNotificationScalarWhereWithAggregatesInput = {
    AND?: ExpirationNotificationScalarWhereWithAggregatesInput | ExpirationNotificationScalarWhereWithAggregatesInput[]
    OR?: ExpirationNotificationScalarWhereWithAggregatesInput[]
    NOT?: ExpirationNotificationScalarWhereWithAggregatesInput | ExpirationNotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExpirationNotification"> | string
    tenantId?: StringWithAggregatesFilter<"ExpirationNotification"> | string
    type?: StringWithAggregatesFilter<"ExpirationNotification"> | string
    daysLeft?: IntNullableWithAggregatesFilter<"ExpirationNotification"> | number | null
    sentAt?: DateTimeWithAggregatesFilter<"ExpirationNotification"> | Date | string
    emailSent?: BoolWithAggregatesFilter<"ExpirationNotification"> | boolean
  }

  export type SuperAdminAccessWhereInput = {
    AND?: SuperAdminAccessWhereInput | SuperAdminAccessWhereInput[]
    OR?: SuperAdminAccessWhereInput[]
    NOT?: SuperAdminAccessWhereInput | SuperAdminAccessWhereInput[]
    id?: StringFilter<"SuperAdminAccess"> | string
    tenantId?: StringFilter<"SuperAdminAccess"> | string
    adminEmail?: StringFilter<"SuperAdminAccess"> | string
    accessToken?: StringNullableFilter<"SuperAdminAccess"> | string | null
    lastAccessed?: DateTimeNullableFilter<"SuperAdminAccess"> | Date | string | null
    accessLogs?: JsonNullableFilter<"SuperAdminAccess">
    createdAt?: DateTimeFilter<"SuperAdminAccess"> | Date | string
    updatedAt?: DateTimeFilter<"SuperAdminAccess"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type SuperAdminAccessOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    adminEmail?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    lastAccessed?: SortOrderInput | SortOrder
    accessLogs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: SuperAdminAccessOrderByRelevanceInput
  }

  export type SuperAdminAccessWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId?: string
    AND?: SuperAdminAccessWhereInput | SuperAdminAccessWhereInput[]
    OR?: SuperAdminAccessWhereInput[]
    NOT?: SuperAdminAccessWhereInput | SuperAdminAccessWhereInput[]
    adminEmail?: StringFilter<"SuperAdminAccess"> | string
    accessToken?: StringNullableFilter<"SuperAdminAccess"> | string | null
    lastAccessed?: DateTimeNullableFilter<"SuperAdminAccess"> | Date | string | null
    accessLogs?: JsonNullableFilter<"SuperAdminAccess">
    createdAt?: DateTimeFilter<"SuperAdminAccess"> | Date | string
    updatedAt?: DateTimeFilter<"SuperAdminAccess"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "tenantId">

  export type SuperAdminAccessOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    adminEmail?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    lastAccessed?: SortOrderInput | SortOrder
    accessLogs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SuperAdminAccessCountOrderByAggregateInput
    _max?: SuperAdminAccessMaxOrderByAggregateInput
    _min?: SuperAdminAccessMinOrderByAggregateInput
  }

  export type SuperAdminAccessScalarWhereWithAggregatesInput = {
    AND?: SuperAdminAccessScalarWhereWithAggregatesInput | SuperAdminAccessScalarWhereWithAggregatesInput[]
    OR?: SuperAdminAccessScalarWhereWithAggregatesInput[]
    NOT?: SuperAdminAccessScalarWhereWithAggregatesInput | SuperAdminAccessScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SuperAdminAccess"> | string
    tenantId?: StringWithAggregatesFilter<"SuperAdminAccess"> | string
    adminEmail?: StringWithAggregatesFilter<"SuperAdminAccess"> | string
    accessToken?: StringNullableWithAggregatesFilter<"SuperAdminAccess"> | string | null
    lastAccessed?: DateTimeNullableWithAggregatesFilter<"SuperAdminAccess"> | Date | string | null
    accessLogs?: JsonNullableWithAggregatesFilter<"SuperAdminAccess">
    createdAt?: DateTimeWithAggregatesFilter<"SuperAdminAccess"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SuperAdminAccess"> | Date | string
  }

  export type PlanCreateInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    period?: string
    description?: string | null
    status?: boolean
    maxBarbers?: number
    maxServices?: number
    maxServiceOptions?: number
    maxBookingsPerMonth?: number
    maxBarberShops?: number
    maxStorageMB?: number
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: number
    requiresCard?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutPlanInput
    tenants?: TenantCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    period?: string
    description?: string | null
    status?: boolean
    maxBarbers?: number
    maxServices?: number
    maxServiceOptions?: number
    maxBookingsPerMonth?: number
    maxBarberShops?: number
    maxStorageMB?: number
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: number
    requiresCard?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutPlanInput
    tenants?: TenantUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    maxBarbers?: IntFieldUpdateOperationsInput | number
    maxServices?: IntFieldUpdateOperationsInput | number
    maxServiceOptions?: IntFieldUpdateOperationsInput | number
    maxBookingsPerMonth?: IntFieldUpdateOperationsInput | number
    maxBarberShops?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    hasAnalytics?: BoolFieldUpdateOperationsInput | boolean
    hasNotifications?: BoolFieldUpdateOperationsInput | boolean
    hasCustomDomain?: BoolFieldUpdateOperationsInput | boolean
    hasWhiteLabel?: BoolFieldUpdateOperationsInput | boolean
    hasAPI?: BoolFieldUpdateOperationsInput | boolean
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: IntFieldUpdateOperationsInput | number
    requiresCard?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutPlanNestedInput
    tenants?: TenantUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    maxBarbers?: IntFieldUpdateOperationsInput | number
    maxServices?: IntFieldUpdateOperationsInput | number
    maxServiceOptions?: IntFieldUpdateOperationsInput | number
    maxBookingsPerMonth?: IntFieldUpdateOperationsInput | number
    maxBarberShops?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    hasAnalytics?: BoolFieldUpdateOperationsInput | boolean
    hasNotifications?: BoolFieldUpdateOperationsInput | boolean
    hasCustomDomain?: BoolFieldUpdateOperationsInput | boolean
    hasWhiteLabel?: BoolFieldUpdateOperationsInput | boolean
    hasAPI?: BoolFieldUpdateOperationsInput | boolean
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: IntFieldUpdateOperationsInput | number
    requiresCard?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutPlanNestedInput
    tenants?: TenantUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanCreateManyInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    period?: string
    description?: string | null
    status?: boolean
    maxBarbers?: number
    maxServices?: number
    maxServiceOptions?: number
    maxBookingsPerMonth?: number
    maxBarberShops?: number
    maxStorageMB?: number
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: number
    requiresCard?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    maxBarbers?: IntFieldUpdateOperationsInput | number
    maxServices?: IntFieldUpdateOperationsInput | number
    maxServiceOptions?: IntFieldUpdateOperationsInput | number
    maxBookingsPerMonth?: IntFieldUpdateOperationsInput | number
    maxBarberShops?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    hasAnalytics?: BoolFieldUpdateOperationsInput | boolean
    hasNotifications?: BoolFieldUpdateOperationsInput | boolean
    hasCustomDomain?: BoolFieldUpdateOperationsInput | boolean
    hasWhiteLabel?: BoolFieldUpdateOperationsInput | boolean
    hasAPI?: BoolFieldUpdateOperationsInput | boolean
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: IntFieldUpdateOperationsInput | number
    requiresCard?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    maxBarbers?: IntFieldUpdateOperationsInput | number
    maxServices?: IntFieldUpdateOperationsInput | number
    maxServiceOptions?: IntFieldUpdateOperationsInput | number
    maxBookingsPerMonth?: IntFieldUpdateOperationsInput | number
    maxBarberShops?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    hasAnalytics?: BoolFieldUpdateOperationsInput | boolean
    hasNotifications?: BoolFieldUpdateOperationsInput | boolean
    hasCustomDomain?: BoolFieldUpdateOperationsInput | boolean
    hasWhiteLabel?: BoolFieldUpdateOperationsInput | boolean
    hasAPI?: BoolFieldUpdateOperationsInput | boolean
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: IntFieldUpdateOperationsInput | number
    requiresCard?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    plan?: PlanCreateNestedOneWithoutTenantsInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageCreateNestedManyWithoutTenantInput
    promotions?: PromotionCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessCreateNestedOneWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    planId?: string | null
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutTenantInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationUncheckedCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneWithoutTenantsNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUncheckedUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUncheckedUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    planId?: string | null
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput
    plan: PlanCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    tenantId: string
    planId: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsNestedInput
    plan?: PlanUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    tenantId: string
    planId: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionCreateInput = {
    id?: string
    name: string
    description?: string | null
    code: string
    discountType: string
    discountValue: Decimal | DecimalJsLike | number | string
    maxUses?: number | null
    currentUses?: number
    validFrom: Date | string
    validUntil?: Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant?: TenantCreateNestedOneWithoutPromotionsInput
  }

  export type PromotionUncheckedCreateInput = {
    id?: string
    tenantId?: string | null
    name: string
    description?: string | null
    code: string
    discountType: string
    discountValue: Decimal | DecimalJsLike | number | string
    maxUses?: number | null
    currentUses?: number
    validFrom: Date | string
    validUntil?: Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    currentUses?: IntFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneWithoutPromotionsNestedInput
  }

  export type PromotionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    currentUses?: IntFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionCreateManyInput = {
    id?: string
    tenantId?: string | null
    name: string
    description?: string | null
    code: string
    discountType: string
    discountValue: Decimal | DecimalJsLike | number | string
    maxUses?: number | null
    currentUses?: number
    validFrom: Date | string
    validUntil?: Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    currentUses?: IntFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    currentUses?: IntFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    senderId: string
    senderName: string
    senderType: string
    message: string
    isRead?: boolean
    readAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    tenant?: TenantCreateNestedOneWithoutChatMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    tenantId?: string | null
    senderId: string
    senderName: string
    senderType: string
    message: string
    isRead?: boolean
    readAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    senderType?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneWithoutChatMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    senderType?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    tenantId?: string | null
    senderId: string
    senderName: string
    senderType: string
    message: string
    isRead?: boolean
    readAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    senderType?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    senderType?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandingPageImageCreateInput = {
    id?: string
    section: string
    position: string
    imageUrl: string
    altText?: string | null
    order?: number
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LandingPageImageUncheckedCreateInput = {
    id?: string
    section: string
    position: string
    imageUrl: string
    altText?: string | null
    order?: number
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LandingPageImageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandingPageImageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandingPageImageCreateManyInput = {
    id?: string
    section: string
    position: string
    imageUrl: string
    altText?: string | null
    order?: number
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LandingPageImageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandingPageImageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandingPageConfigCreateInput = {
    id?: string
    key: string
    value: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LandingPageConfigUncheckedCreateInput = {
    id?: string
    key: string
    value: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LandingPageConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandingPageConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandingPageConfigCreateManyInput = {
    id?: string
    key: string
    value: string
    type?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LandingPageConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandingPageConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportCreateInput = {
    id?: string
    type: string
    period: string
    data: JsonNullValueInput | InputJsonValue
    generatedAt?: Date | string
    periodStart: Date | string
    periodEnd: Date | string
  }

  export type ReportUncheckedCreateInput = {
    id?: string
    type: string
    period: string
    data: JsonNullValueInput | InputJsonValue
    generatedAt?: Date | string
    periodStart: Date | string
    periodEnd: Date | string
  }

  export type ReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportCreateManyInput = {
    id?: string
    type: string
    period: string
    data: JsonNullValueInput | InputJsonValue
    generatedAt?: Date | string
    periodStart: Date | string
    periodEnd: Date | string
  }

  export type ReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpirationNotificationCreateInput = {
    id?: string
    type: string
    daysLeft?: number | null
    sentAt?: Date | string
    emailSent?: boolean
    tenant: TenantCreateNestedOneWithoutExpirationNotificationsInput
  }

  export type ExpirationNotificationUncheckedCreateInput = {
    id?: string
    tenantId: string
    type: string
    daysLeft?: number | null
    sentAt?: Date | string
    emailSent?: boolean
  }

  export type ExpirationNotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    daysLeft?: NullableIntFieldUpdateOperationsInput | number | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailSent?: BoolFieldUpdateOperationsInput | boolean
    tenant?: TenantUpdateOneRequiredWithoutExpirationNotificationsNestedInput
  }

  export type ExpirationNotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    daysLeft?: NullableIntFieldUpdateOperationsInput | number | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailSent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExpirationNotificationCreateManyInput = {
    id?: string
    tenantId: string
    type: string
    daysLeft?: number | null
    sentAt?: Date | string
    emailSent?: boolean
  }

  export type ExpirationNotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    daysLeft?: NullableIntFieldUpdateOperationsInput | number | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailSent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExpirationNotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    daysLeft?: NullableIntFieldUpdateOperationsInput | number | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailSent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SuperAdminAccessCreateInput = {
    id?: string
    adminEmail: string
    accessToken?: string | null
    lastAccessed?: Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSuperAdminAccessInput
  }

  export type SuperAdminAccessUncheckedCreateInput = {
    id?: string
    tenantId: string
    adminEmail: string
    accessToken?: string | null
    lastAccessed?: Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminAccessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSuperAdminAccessNestedInput
  }

  export type SuperAdminAccessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminAccessCreateManyInput = {
    id?: string
    tenantId: string
    adminEmail: string
    accessToken?: string | null
    lastAccessed?: Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminAccessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminAccessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type TenantListRelationFilter = {
    every?: TenantWhereInput
    some?: TenantWhereInput
    none?: TenantWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanOrderByRelevanceInput = {
    fields: PlanOrderByRelevanceFieldEnum | PlanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PlanCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    period?: SortOrder
    description?: SortOrder
    status?: SortOrder
    maxBarbers?: SortOrder
    maxServices?: SortOrder
    maxServiceOptions?: SortOrder
    maxBookingsPerMonth?: SortOrder
    maxBarberShops?: SortOrder
    maxStorageMB?: SortOrder
    hasAnalytics?: SortOrder
    hasNotifications?: SortOrder
    hasCustomDomain?: SortOrder
    hasWhiteLabel?: SortOrder
    hasAPI?: SortOrder
    hasPrioritySupport?: SortOrder
    features?: SortOrder
    trialDays?: SortOrder
    requiresCard?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlanAvgOrderByAggregateInput = {
    price?: SortOrder
    maxBarbers?: SortOrder
    maxServices?: SortOrder
    maxServiceOptions?: SortOrder
    maxBookingsPerMonth?: SortOrder
    maxBarberShops?: SortOrder
    maxStorageMB?: SortOrder
    trialDays?: SortOrder
  }

  export type PlanMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    period?: SortOrder
    description?: SortOrder
    status?: SortOrder
    maxBarbers?: SortOrder
    maxServices?: SortOrder
    maxServiceOptions?: SortOrder
    maxBookingsPerMonth?: SortOrder
    maxBarberShops?: SortOrder
    maxStorageMB?: SortOrder
    hasAnalytics?: SortOrder
    hasNotifications?: SortOrder
    hasCustomDomain?: SortOrder
    hasWhiteLabel?: SortOrder
    hasAPI?: SortOrder
    hasPrioritySupport?: SortOrder
    trialDays?: SortOrder
    requiresCard?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlanMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    period?: SortOrder
    description?: SortOrder
    status?: SortOrder
    maxBarbers?: SortOrder
    maxServices?: SortOrder
    maxServiceOptions?: SortOrder
    maxBookingsPerMonth?: SortOrder
    maxBarberShops?: SortOrder
    maxStorageMB?: SortOrder
    hasAnalytics?: SortOrder
    hasNotifications?: SortOrder
    hasCustomDomain?: SortOrder
    hasWhiteLabel?: SortOrder
    hasAPI?: SortOrder
    hasPrioritySupport?: SortOrder
    trialDays?: SortOrder
    requiresCard?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlanSumOrderByAggregateInput = {
    price?: SortOrder
    maxBarbers?: SortOrder
    maxServices?: SortOrder
    maxServiceOptions?: SortOrder
    maxBookingsPerMonth?: SortOrder
    maxBarberShops?: SortOrder
    maxStorageMB?: SortOrder
    trialDays?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PlanNullableScalarRelationFilter = {
    is?: PlanWhereInput | null
    isNot?: PlanWhereInput | null
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type PromotionListRelationFilter = {
    every?: PromotionWhereInput
    some?: PromotionWhereInput
    none?: PromotionWhereInput
  }

  export type ExpirationNotificationListRelationFilter = {
    every?: ExpirationNotificationWhereInput
    some?: ExpirationNotificationWhereInput
    none?: ExpirationNotificationWhereInput
  }

  export type SuperAdminAccessNullableScalarRelationFilter = {
    is?: SuperAdminAccessWhereInput | null
    isNot?: SuperAdminAccessWhereInput | null
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PromotionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExpirationNotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantOrderByRelevanceInput = {
    fields: TenantOrderByRelevanceFieldEnum | TenantOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrder
    ownerName?: SortOrder
    ownerEmail?: SortOrder
    ownerPhone?: SortOrder
    databaseName?: SortOrder
    databaseUrl?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    planId?: SortOrder
    trialStartDate?: SortOrder
    trialEndDate?: SortOrder
    trialUsed?: SortOrder
    asaasCustomerId?: SortOrder
    asaasSubscriptionId?: SortOrder
    currentBarbers?: SortOrder
    currentServices?: SortOrder
    currentBookingsThisMonth?: SortOrder
    currentBarberShops?: SortOrder
    currentStorageMB?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    currentBarbers?: SortOrder
    currentServices?: SortOrder
    currentBookingsThisMonth?: SortOrder
    currentBarberShops?: SortOrder
    currentStorageMB?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrder
    ownerName?: SortOrder
    ownerEmail?: SortOrder
    ownerPhone?: SortOrder
    databaseName?: SortOrder
    databaseUrl?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    planId?: SortOrder
    trialStartDate?: SortOrder
    trialEndDate?: SortOrder
    trialUsed?: SortOrder
    asaasCustomerId?: SortOrder
    asaasSubscriptionId?: SortOrder
    currentBarbers?: SortOrder
    currentServices?: SortOrder
    currentBookingsThisMonth?: SortOrder
    currentBarberShops?: SortOrder
    currentStorageMB?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    subdomain?: SortOrder
    customDomain?: SortOrder
    ownerName?: SortOrder
    ownerEmail?: SortOrder
    ownerPhone?: SortOrder
    databaseName?: SortOrder
    databaseUrl?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    planId?: SortOrder
    trialStartDate?: SortOrder
    trialEndDate?: SortOrder
    trialUsed?: SortOrder
    asaasCustomerId?: SortOrder
    asaasSubscriptionId?: SortOrder
    currentBarbers?: SortOrder
    currentServices?: SortOrder
    currentBookingsThisMonth?: SortOrder
    currentBarberShops?: SortOrder
    currentStorageMB?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    currentBarbers?: SortOrder
    currentServices?: SortOrder
    currentBookingsThisMonth?: SortOrder
    currentBarberShops?: SortOrder
    currentStorageMB?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type PlanScalarRelationFilter = {
    is?: PlanWhereInput
    isNot?: PlanWhereInput
  }

  export type SubscriptionOrderByRelevanceInput = {
    fields: SubscriptionOrderByRelevanceFieldEnum | SubscriptionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    cancelledAt?: SortOrder
    asaasSubscriptionId?: SortOrder
    paymentMethod?: SortOrder
    amount?: SortOrder
    autoRenew?: SortOrder
    nextBillingDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    cancelledAt?: SortOrder
    asaasSubscriptionId?: SortOrder
    paymentMethod?: SortOrder
    amount?: SortOrder
    autoRenew?: SortOrder
    nextBillingDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    cancelledAt?: SortOrder
    asaasSubscriptionId?: SortOrder
    paymentMethod?: SortOrder
    amount?: SortOrder
    autoRenew?: SortOrder
    nextBillingDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TenantNullableScalarRelationFilter = {
    is?: TenantWhereInput | null
    isNot?: TenantWhereInput | null
  }

  export type PromotionOrderByRelevanceInput = {
    fields: PromotionOrderByRelevanceFieldEnum | PromotionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PromotionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    code?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxUses?: SortOrder
    currentUses?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
    planIds?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PromotionAvgOrderByAggregateInput = {
    discountValue?: SortOrder
    maxUses?: SortOrder
    currentUses?: SortOrder
  }

  export type PromotionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    code?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxUses?: SortOrder
    currentUses?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PromotionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    code?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxUses?: SortOrder
    currentUses?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PromotionSumOrderByAggregateInput = {
    discountValue?: SortOrder
    maxUses?: SortOrder
    currentUses?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type ChatMessageOrderByRelevanceInput = {
    fields: ChatMessageOrderByRelevanceFieldEnum | ChatMessageOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    senderType?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    senderType?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    senderId?: SortOrder
    senderName?: SortOrder
    senderType?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LandingPageImageOrderByRelevanceInput = {
    fields: LandingPageImageOrderByRelevanceFieldEnum | LandingPageImageOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LandingPageImageSectionPositionCompoundUniqueInput = {
    section: string
    position: string
  }

  export type LandingPageImageCountOrderByAggregateInput = {
    id?: SortOrder
    section?: SortOrder
    position?: SortOrder
    imageUrl?: SortOrder
    altText?: SortOrder
    order?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LandingPageImageAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type LandingPageImageMaxOrderByAggregateInput = {
    id?: SortOrder
    section?: SortOrder
    position?: SortOrder
    imageUrl?: SortOrder
    altText?: SortOrder
    order?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LandingPageImageMinOrderByAggregateInput = {
    id?: SortOrder
    section?: SortOrder
    position?: SortOrder
    imageUrl?: SortOrder
    altText?: SortOrder
    order?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LandingPageImageSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type LandingPageConfigOrderByRelevanceInput = {
    fields: LandingPageConfigOrderByRelevanceFieldEnum | LandingPageConfigOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LandingPageConfigCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LandingPageConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LandingPageConfigMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ReportOrderByRelevanceInput = {
    fields: ReportOrderByRelevanceFieldEnum | ReportOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ReportCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    data?: SortOrder
    generatedAt?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
  }

  export type ReportMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    generatedAt?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
  }

  export type ReportMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    generatedAt?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ExpirationNotificationOrderByRelevanceInput = {
    fields: ExpirationNotificationOrderByRelevanceFieldEnum | ExpirationNotificationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ExpirationNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    type?: SortOrder
    daysLeft?: SortOrder
    sentAt?: SortOrder
    emailSent?: SortOrder
  }

  export type ExpirationNotificationAvgOrderByAggregateInput = {
    daysLeft?: SortOrder
  }

  export type ExpirationNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    type?: SortOrder
    daysLeft?: SortOrder
    sentAt?: SortOrder
    emailSent?: SortOrder
  }

  export type ExpirationNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    type?: SortOrder
    daysLeft?: SortOrder
    sentAt?: SortOrder
    emailSent?: SortOrder
  }

  export type ExpirationNotificationSumOrderByAggregateInput = {
    daysLeft?: SortOrder
  }

  export type SuperAdminAccessOrderByRelevanceInput = {
    fields: SuperAdminAccessOrderByRelevanceFieldEnum | SuperAdminAccessOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SuperAdminAccessCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    adminEmail?: SortOrder
    accessToken?: SortOrder
    lastAccessed?: SortOrder
    accessLogs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SuperAdminAccessMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    adminEmail?: SortOrder
    accessToken?: SortOrder
    lastAccessed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SuperAdminAccessMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    adminEmail?: SortOrder
    accessToken?: SortOrder
    lastAccessed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionCreateNestedManyWithoutPlanInput = {
    create?: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput> | SubscriptionCreateWithoutPlanInput[] | SubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: SubscriptionCreateManyPlanInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type TenantCreateNestedManyWithoutPlanInput = {
    create?: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput> | TenantCreateWithoutPlanInput[] | TenantUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPlanInput | TenantCreateOrConnectWithoutPlanInput[]
    createMany?: TenantCreateManyPlanInputEnvelope
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput> | SubscriptionCreateWithoutPlanInput[] | SubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: SubscriptionCreateManyPlanInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type TenantUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput> | TenantCreateWithoutPlanInput[] | TenantUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPlanInput | TenantCreateOrConnectWithoutPlanInput[]
    createMany?: TenantCreateManyPlanInputEnvelope
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SubscriptionUpdateManyWithoutPlanNestedInput = {
    create?: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput> | SubscriptionCreateWithoutPlanInput[] | SubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutPlanInput | SubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: SubscriptionCreateManyPlanInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutPlanInput | SubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutPlanInput | SubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type TenantUpdateManyWithoutPlanNestedInput = {
    create?: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput> | TenantCreateWithoutPlanInput[] | TenantUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPlanInput | TenantCreateOrConnectWithoutPlanInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutPlanInput | TenantUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: TenantCreateManyPlanInputEnvelope
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutPlanInput | TenantUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutPlanInput | TenantUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput> | SubscriptionCreateWithoutPlanInput[] | SubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutPlanInput | SubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: SubscriptionCreateManyPlanInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutPlanInput | SubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutPlanInput | SubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type TenantUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput> | TenantCreateWithoutPlanInput[] | TenantUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPlanInput | TenantCreateOrConnectWithoutPlanInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutPlanInput | TenantUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: TenantCreateManyPlanInputEnvelope
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutPlanInput | TenantUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutPlanInput | TenantUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type PlanCreateNestedOneWithoutTenantsInput = {
    create?: XOR<PlanCreateWithoutTenantsInput, PlanUncheckedCreateWithoutTenantsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutTenantsInput
    connect?: PlanWhereUniqueInput
  }

  export type SubscriptionCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type ChatMessageCreateNestedManyWithoutTenantInput = {
    create?: XOR<ChatMessageCreateWithoutTenantInput, ChatMessageUncheckedCreateWithoutTenantInput> | ChatMessageCreateWithoutTenantInput[] | ChatMessageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutTenantInput | ChatMessageCreateOrConnectWithoutTenantInput[]
    createMany?: ChatMessageCreateManyTenantInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type PromotionCreateNestedManyWithoutTenantInput = {
    create?: XOR<PromotionCreateWithoutTenantInput, PromotionUncheckedCreateWithoutTenantInput> | PromotionCreateWithoutTenantInput[] | PromotionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PromotionCreateOrConnectWithoutTenantInput | PromotionCreateOrConnectWithoutTenantInput[]
    createMany?: PromotionCreateManyTenantInputEnvelope
    connect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
  }

  export type ExpirationNotificationCreateNestedManyWithoutTenantInput = {
    create?: XOR<ExpirationNotificationCreateWithoutTenantInput, ExpirationNotificationUncheckedCreateWithoutTenantInput> | ExpirationNotificationCreateWithoutTenantInput[] | ExpirationNotificationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ExpirationNotificationCreateOrConnectWithoutTenantInput | ExpirationNotificationCreateOrConnectWithoutTenantInput[]
    createMany?: ExpirationNotificationCreateManyTenantInputEnvelope
    connect?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
  }

  export type SuperAdminAccessCreateNestedOneWithoutTenantInput = {
    create?: XOR<SuperAdminAccessCreateWithoutTenantInput, SuperAdminAccessUncheckedCreateWithoutTenantInput>
    connectOrCreate?: SuperAdminAccessCreateOrConnectWithoutTenantInput
    connect?: SuperAdminAccessWhereUniqueInput
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<ChatMessageCreateWithoutTenantInput, ChatMessageUncheckedCreateWithoutTenantInput> | ChatMessageCreateWithoutTenantInput[] | ChatMessageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutTenantInput | ChatMessageCreateOrConnectWithoutTenantInput[]
    createMany?: ChatMessageCreateManyTenantInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type PromotionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<PromotionCreateWithoutTenantInput, PromotionUncheckedCreateWithoutTenantInput> | PromotionCreateWithoutTenantInput[] | PromotionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PromotionCreateOrConnectWithoutTenantInput | PromotionCreateOrConnectWithoutTenantInput[]
    createMany?: PromotionCreateManyTenantInputEnvelope
    connect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
  }

  export type ExpirationNotificationUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<ExpirationNotificationCreateWithoutTenantInput, ExpirationNotificationUncheckedCreateWithoutTenantInput> | ExpirationNotificationCreateWithoutTenantInput[] | ExpirationNotificationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ExpirationNotificationCreateOrConnectWithoutTenantInput | ExpirationNotificationCreateOrConnectWithoutTenantInput[]
    createMany?: ExpirationNotificationCreateManyTenantInputEnvelope
    connect?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
  }

  export type SuperAdminAccessUncheckedCreateNestedOneWithoutTenantInput = {
    create?: XOR<SuperAdminAccessCreateWithoutTenantInput, SuperAdminAccessUncheckedCreateWithoutTenantInput>
    connectOrCreate?: SuperAdminAccessCreateOrConnectWithoutTenantInput
    connect?: SuperAdminAccessWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PlanUpdateOneWithoutTenantsNestedInput = {
    create?: XOR<PlanCreateWithoutTenantsInput, PlanUncheckedCreateWithoutTenantsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutTenantsInput
    upsert?: PlanUpsertWithoutTenantsInput
    disconnect?: PlanWhereInput | boolean
    delete?: PlanWhereInput | boolean
    connect?: PlanWhereUniqueInput
    update?: XOR<XOR<PlanUpdateToOneWithWhereWithoutTenantsInput, PlanUpdateWithoutTenantsInput>, PlanUncheckedUpdateWithoutTenantsInput>
  }

  export type SubscriptionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutTenantInput | SubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutTenantInput | SubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutTenantInput | SubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type ChatMessageUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ChatMessageCreateWithoutTenantInput, ChatMessageUncheckedCreateWithoutTenantInput> | ChatMessageCreateWithoutTenantInput[] | ChatMessageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutTenantInput | ChatMessageCreateOrConnectWithoutTenantInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutTenantInput | ChatMessageUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ChatMessageCreateManyTenantInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutTenantInput | ChatMessageUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutTenantInput | ChatMessageUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type PromotionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PromotionCreateWithoutTenantInput, PromotionUncheckedCreateWithoutTenantInput> | PromotionCreateWithoutTenantInput[] | PromotionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PromotionCreateOrConnectWithoutTenantInput | PromotionCreateOrConnectWithoutTenantInput[]
    upsert?: PromotionUpsertWithWhereUniqueWithoutTenantInput | PromotionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PromotionCreateManyTenantInputEnvelope
    set?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    disconnect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    delete?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    connect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    update?: PromotionUpdateWithWhereUniqueWithoutTenantInput | PromotionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PromotionUpdateManyWithWhereWithoutTenantInput | PromotionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PromotionScalarWhereInput | PromotionScalarWhereInput[]
  }

  export type ExpirationNotificationUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ExpirationNotificationCreateWithoutTenantInput, ExpirationNotificationUncheckedCreateWithoutTenantInput> | ExpirationNotificationCreateWithoutTenantInput[] | ExpirationNotificationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ExpirationNotificationCreateOrConnectWithoutTenantInput | ExpirationNotificationCreateOrConnectWithoutTenantInput[]
    upsert?: ExpirationNotificationUpsertWithWhereUniqueWithoutTenantInput | ExpirationNotificationUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ExpirationNotificationCreateManyTenantInputEnvelope
    set?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
    disconnect?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
    delete?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
    connect?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
    update?: ExpirationNotificationUpdateWithWhereUniqueWithoutTenantInput | ExpirationNotificationUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ExpirationNotificationUpdateManyWithWhereWithoutTenantInput | ExpirationNotificationUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ExpirationNotificationScalarWhereInput | ExpirationNotificationScalarWhereInput[]
  }

  export type SuperAdminAccessUpdateOneWithoutTenantNestedInput = {
    create?: XOR<SuperAdminAccessCreateWithoutTenantInput, SuperAdminAccessUncheckedCreateWithoutTenantInput>
    connectOrCreate?: SuperAdminAccessCreateOrConnectWithoutTenantInput
    upsert?: SuperAdminAccessUpsertWithoutTenantInput
    disconnect?: SuperAdminAccessWhereInput | boolean
    delete?: SuperAdminAccessWhereInput | boolean
    connect?: SuperAdminAccessWhereUniqueInput
    update?: XOR<XOR<SuperAdminAccessUpdateToOneWithWhereWithoutTenantInput, SuperAdminAccessUpdateWithoutTenantInput>, SuperAdminAccessUncheckedUpdateWithoutTenantInput>
  }

  export type SubscriptionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutTenantInput | SubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutTenantInput | SubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutTenantInput | SubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ChatMessageCreateWithoutTenantInput, ChatMessageUncheckedCreateWithoutTenantInput> | ChatMessageCreateWithoutTenantInput[] | ChatMessageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutTenantInput | ChatMessageCreateOrConnectWithoutTenantInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutTenantInput | ChatMessageUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ChatMessageCreateManyTenantInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutTenantInput | ChatMessageUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutTenantInput | ChatMessageUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type PromotionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PromotionCreateWithoutTenantInput, PromotionUncheckedCreateWithoutTenantInput> | PromotionCreateWithoutTenantInput[] | PromotionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PromotionCreateOrConnectWithoutTenantInput | PromotionCreateOrConnectWithoutTenantInput[]
    upsert?: PromotionUpsertWithWhereUniqueWithoutTenantInput | PromotionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PromotionCreateManyTenantInputEnvelope
    set?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    disconnect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    delete?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    connect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    update?: PromotionUpdateWithWhereUniqueWithoutTenantInput | PromotionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PromotionUpdateManyWithWhereWithoutTenantInput | PromotionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PromotionScalarWhereInput | PromotionScalarWhereInput[]
  }

  export type ExpirationNotificationUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ExpirationNotificationCreateWithoutTenantInput, ExpirationNotificationUncheckedCreateWithoutTenantInput> | ExpirationNotificationCreateWithoutTenantInput[] | ExpirationNotificationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ExpirationNotificationCreateOrConnectWithoutTenantInput | ExpirationNotificationCreateOrConnectWithoutTenantInput[]
    upsert?: ExpirationNotificationUpsertWithWhereUniqueWithoutTenantInput | ExpirationNotificationUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ExpirationNotificationCreateManyTenantInputEnvelope
    set?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
    disconnect?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
    delete?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
    connect?: ExpirationNotificationWhereUniqueInput | ExpirationNotificationWhereUniqueInput[]
    update?: ExpirationNotificationUpdateWithWhereUniqueWithoutTenantInput | ExpirationNotificationUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ExpirationNotificationUpdateManyWithWhereWithoutTenantInput | ExpirationNotificationUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ExpirationNotificationScalarWhereInput | ExpirationNotificationScalarWhereInput[]
  }

  export type SuperAdminAccessUncheckedUpdateOneWithoutTenantNestedInput = {
    create?: XOR<SuperAdminAccessCreateWithoutTenantInput, SuperAdminAccessUncheckedCreateWithoutTenantInput>
    connectOrCreate?: SuperAdminAccessCreateOrConnectWithoutTenantInput
    upsert?: SuperAdminAccessUpsertWithoutTenantInput
    disconnect?: SuperAdminAccessWhereInput | boolean
    delete?: SuperAdminAccessWhereInput | boolean
    connect?: SuperAdminAccessWhereUniqueInput
    update?: XOR<XOR<SuperAdminAccessUpdateToOneWithWhereWithoutTenantInput, SuperAdminAccessUpdateWithoutTenantInput>, SuperAdminAccessUncheckedUpdateWithoutTenantInput>
  }

  export type TenantCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionsInput
    connect?: TenantWhereUniqueInput
  }

  export type PlanCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<PlanCreateWithoutSubscriptionsInput, PlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutSubscriptionsInput
    connect?: PlanWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type TenantUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionsInput
    upsert?: TenantUpsertWithoutSubscriptionsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSubscriptionsInput, TenantUpdateWithoutSubscriptionsInput>, TenantUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type PlanUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<PlanCreateWithoutSubscriptionsInput, PlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutSubscriptionsInput
    upsert?: PlanUpsertWithoutSubscriptionsInput
    connect?: PlanWhereUniqueInput
    update?: XOR<XOR<PlanUpdateToOneWithWhereWithoutSubscriptionsInput, PlanUpdateWithoutSubscriptionsInput>, PlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type TenantCreateNestedOneWithoutPromotionsInput = {
    create?: XOR<TenantCreateWithoutPromotionsInput, TenantUncheckedCreateWithoutPromotionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPromotionsInput
    connect?: TenantWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TenantUpdateOneWithoutPromotionsNestedInput = {
    create?: XOR<TenantCreateWithoutPromotionsInput, TenantUncheckedCreateWithoutPromotionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPromotionsInput
    upsert?: TenantUpsertWithoutPromotionsInput
    disconnect?: TenantWhereInput | boolean
    delete?: TenantWhereInput | boolean
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutPromotionsInput, TenantUpdateWithoutPromotionsInput>, TenantUncheckedUpdateWithoutPromotionsInput>
  }

  export type TenantCreateNestedOneWithoutChatMessagesInput = {
    create?: XOR<TenantCreateWithoutChatMessagesInput, TenantUncheckedCreateWithoutChatMessagesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutChatMessagesInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneWithoutChatMessagesNestedInput = {
    create?: XOR<TenantCreateWithoutChatMessagesInput, TenantUncheckedCreateWithoutChatMessagesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutChatMessagesInput
    upsert?: TenantUpsertWithoutChatMessagesInput
    disconnect?: TenantWhereInput | boolean
    delete?: TenantWhereInput | boolean
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutChatMessagesInput, TenantUpdateWithoutChatMessagesInput>, TenantUncheckedUpdateWithoutChatMessagesInput>
  }

  export type TenantCreateNestedOneWithoutExpirationNotificationsInput = {
    create?: XOR<TenantCreateWithoutExpirationNotificationsInput, TenantUncheckedCreateWithoutExpirationNotificationsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutExpirationNotificationsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutExpirationNotificationsNestedInput = {
    create?: XOR<TenantCreateWithoutExpirationNotificationsInput, TenantUncheckedCreateWithoutExpirationNotificationsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutExpirationNotificationsInput
    upsert?: TenantUpsertWithoutExpirationNotificationsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutExpirationNotificationsInput, TenantUpdateWithoutExpirationNotificationsInput>, TenantUncheckedUpdateWithoutExpirationNotificationsInput>
  }

  export type TenantCreateNestedOneWithoutSuperAdminAccessInput = {
    create?: XOR<TenantCreateWithoutSuperAdminAccessInput, TenantUncheckedCreateWithoutSuperAdminAccessInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSuperAdminAccessInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutSuperAdminAccessNestedInput = {
    create?: XOR<TenantCreateWithoutSuperAdminAccessInput, TenantUncheckedCreateWithoutSuperAdminAccessInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSuperAdminAccessInput
    upsert?: TenantUpsertWithoutSuperAdminAccessInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSuperAdminAccessInput, TenantUpdateWithoutSuperAdminAccessInput>, TenantUncheckedUpdateWithoutSuperAdminAccessInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SubscriptionCreateWithoutPlanInput = {
    id?: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateWithoutPlanInput = {
    id?: string
    tenantId: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutPlanInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type SubscriptionCreateManyPlanInputEnvelope = {
    data: SubscriptionCreateManyPlanInput | SubscriptionCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type TenantCreateWithoutPlanInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageCreateNestedManyWithoutTenantInput
    promotions?: PromotionCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessCreateNestedOneWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutPlanInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutTenantInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationUncheckedCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPlanInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput>
  }

  export type TenantCreateManyPlanInputEnvelope = {
    data: TenantCreateManyPlanInput | TenantCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutPlanInput, SubscriptionUncheckedUpdateWithoutPlanInput>
    create: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutPlanInput, SubscriptionUncheckedUpdateWithoutPlanInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutPlanInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutPlanInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    id?: StringFilter<"Subscription"> | string
    tenantId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    isActive?: BoolFilter<"Subscription"> | boolean
    startDate?: DateTimeFilter<"Subscription"> | Date | string
    endDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    asaasSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    paymentMethod?: StringNullableFilter<"Subscription"> | string | null
    amount?: DecimalNullableFilter<"Subscription"> | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFilter<"Subscription"> | boolean
    nextBillingDate?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
  }

  export type TenantUpsertWithWhereUniqueWithoutPlanInput = {
    where: TenantWhereUniqueInput
    update: XOR<TenantUpdateWithoutPlanInput, TenantUncheckedUpdateWithoutPlanInput>
    create: XOR<TenantCreateWithoutPlanInput, TenantUncheckedCreateWithoutPlanInput>
  }

  export type TenantUpdateWithWhereUniqueWithoutPlanInput = {
    where: TenantWhereUniqueInput
    data: XOR<TenantUpdateWithoutPlanInput, TenantUncheckedUpdateWithoutPlanInput>
  }

  export type TenantUpdateManyWithWhereWithoutPlanInput = {
    where: TenantScalarWhereInput
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyWithoutPlanInput>
  }

  export type TenantScalarWhereInput = {
    AND?: TenantScalarWhereInput | TenantScalarWhereInput[]
    OR?: TenantScalarWhereInput[]
    NOT?: TenantScalarWhereInput | TenantScalarWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    subdomain?: StringFilter<"Tenant"> | string
    customDomain?: StringNullableFilter<"Tenant"> | string | null
    ownerName?: StringFilter<"Tenant"> | string
    ownerEmail?: StringFilter<"Tenant"> | string
    ownerPhone?: StringNullableFilter<"Tenant"> | string | null
    databaseName?: StringFilter<"Tenant"> | string
    databaseUrl?: StringFilter<"Tenant"> | string
    status?: StringFilter<"Tenant"> | string
    isActive?: BoolFilter<"Tenant"> | boolean
    planId?: StringNullableFilter<"Tenant"> | string | null
    trialStartDate?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    trialEndDate?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    trialUsed?: BoolFilter<"Tenant"> | boolean
    asaasCustomerId?: StringNullableFilter<"Tenant"> | string | null
    asaasSubscriptionId?: StringNullableFilter<"Tenant"> | string | null
    currentBarbers?: IntFilter<"Tenant"> | number
    currentServices?: IntFilter<"Tenant"> | number
    currentBookingsThisMonth?: IntFilter<"Tenant"> | number
    currentBarberShops?: IntFilter<"Tenant"> | number
    currentStorageMB?: IntFilter<"Tenant"> | number
    metadata?: JsonNullableFilter<"Tenant">
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
  }

  export type PlanCreateWithoutTenantsInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    period?: string
    description?: string | null
    status?: boolean
    maxBarbers?: number
    maxServices?: number
    maxServiceOptions?: number
    maxBookingsPerMonth?: number
    maxBarberShops?: number
    maxStorageMB?: number
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: number
    requiresCard?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateWithoutTenantsInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    period?: string
    description?: string | null
    status?: boolean
    maxBarbers?: number
    maxServices?: number
    maxServiceOptions?: number
    maxBookingsPerMonth?: number
    maxBarberShops?: number
    maxStorageMB?: number
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: number
    requiresCard?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanCreateOrConnectWithoutTenantsInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutTenantsInput, PlanUncheckedCreateWithoutTenantsInput>
  }

  export type SubscriptionCreateWithoutTenantInput = {
    id?: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateWithoutTenantInput = {
    id?: string
    planId: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionCreateManyTenantInputEnvelope = {
    data: SubscriptionCreateManyTenantInput | SubscriptionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type ChatMessageCreateWithoutTenantInput = {
    id?: string
    senderId: string
    senderName: string
    senderType: string
    message: string
    isRead?: boolean
    readAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutTenantInput = {
    id?: string
    senderId: string
    senderName: string
    senderType: string
    message: string
    isRead?: boolean
    readAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutTenantInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutTenantInput, ChatMessageUncheckedCreateWithoutTenantInput>
  }

  export type ChatMessageCreateManyTenantInputEnvelope = {
    data: ChatMessageCreateManyTenantInput | ChatMessageCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type PromotionCreateWithoutTenantInput = {
    id?: string
    name: string
    description?: string | null
    code: string
    discountType: string
    discountValue: Decimal | DecimalJsLike | number | string
    maxUses?: number | null
    currentUses?: number
    validFrom: Date | string
    validUntil?: Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionUncheckedCreateWithoutTenantInput = {
    id?: string
    name: string
    description?: string | null
    code: string
    discountType: string
    discountValue: Decimal | DecimalJsLike | number | string
    maxUses?: number | null
    currentUses?: number
    validFrom: Date | string
    validUntil?: Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionCreateOrConnectWithoutTenantInput = {
    where: PromotionWhereUniqueInput
    create: XOR<PromotionCreateWithoutTenantInput, PromotionUncheckedCreateWithoutTenantInput>
  }

  export type PromotionCreateManyTenantInputEnvelope = {
    data: PromotionCreateManyTenantInput | PromotionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type ExpirationNotificationCreateWithoutTenantInput = {
    id?: string
    type: string
    daysLeft?: number | null
    sentAt?: Date | string
    emailSent?: boolean
  }

  export type ExpirationNotificationUncheckedCreateWithoutTenantInput = {
    id?: string
    type: string
    daysLeft?: number | null
    sentAt?: Date | string
    emailSent?: boolean
  }

  export type ExpirationNotificationCreateOrConnectWithoutTenantInput = {
    where: ExpirationNotificationWhereUniqueInput
    create: XOR<ExpirationNotificationCreateWithoutTenantInput, ExpirationNotificationUncheckedCreateWithoutTenantInput>
  }

  export type ExpirationNotificationCreateManyTenantInputEnvelope = {
    data: ExpirationNotificationCreateManyTenantInput | ExpirationNotificationCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type SuperAdminAccessCreateWithoutTenantInput = {
    id?: string
    adminEmail: string
    accessToken?: string | null
    lastAccessed?: Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminAccessUncheckedCreateWithoutTenantInput = {
    id?: string
    adminEmail: string
    accessToken?: string | null
    lastAccessed?: Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminAccessCreateOrConnectWithoutTenantInput = {
    where: SuperAdminAccessWhereUniqueInput
    create: XOR<SuperAdminAccessCreateWithoutTenantInput, SuperAdminAccessUncheckedCreateWithoutTenantInput>
  }

  export type PlanUpsertWithoutTenantsInput = {
    update: XOR<PlanUpdateWithoutTenantsInput, PlanUncheckedUpdateWithoutTenantsInput>
    create: XOR<PlanCreateWithoutTenantsInput, PlanUncheckedCreateWithoutTenantsInput>
    where?: PlanWhereInput
  }

  export type PlanUpdateToOneWithWhereWithoutTenantsInput = {
    where?: PlanWhereInput
    data: XOR<PlanUpdateWithoutTenantsInput, PlanUncheckedUpdateWithoutTenantsInput>
  }

  export type PlanUpdateWithoutTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    maxBarbers?: IntFieldUpdateOperationsInput | number
    maxServices?: IntFieldUpdateOperationsInput | number
    maxServiceOptions?: IntFieldUpdateOperationsInput | number
    maxBookingsPerMonth?: IntFieldUpdateOperationsInput | number
    maxBarberShops?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    hasAnalytics?: BoolFieldUpdateOperationsInput | boolean
    hasNotifications?: BoolFieldUpdateOperationsInput | boolean
    hasCustomDomain?: BoolFieldUpdateOperationsInput | boolean
    hasWhiteLabel?: BoolFieldUpdateOperationsInput | boolean
    hasAPI?: BoolFieldUpdateOperationsInput | boolean
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: IntFieldUpdateOperationsInput | number
    requiresCard?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateWithoutTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    maxBarbers?: IntFieldUpdateOperationsInput | number
    maxServices?: IntFieldUpdateOperationsInput | number
    maxServiceOptions?: IntFieldUpdateOperationsInput | number
    maxBookingsPerMonth?: IntFieldUpdateOperationsInput | number
    maxBarberShops?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    hasAnalytics?: BoolFieldUpdateOperationsInput | boolean
    hasNotifications?: BoolFieldUpdateOperationsInput | boolean
    hasCustomDomain?: BoolFieldUpdateOperationsInput | boolean
    hasWhiteLabel?: BoolFieldUpdateOperationsInput | boolean
    hasAPI?: BoolFieldUpdateOperationsInput | boolean
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: IntFieldUpdateOperationsInput | number
    requiresCard?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutTenantInput, SubscriptionUncheckedUpdateWithoutTenantInput>
    create: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutTenantInput, SubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutTenantInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutTenantInput>
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutTenantInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutTenantInput, ChatMessageUncheckedUpdateWithoutTenantInput>
    create: XOR<ChatMessageCreateWithoutTenantInput, ChatMessageUncheckedCreateWithoutTenantInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutTenantInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutTenantInput, ChatMessageUncheckedUpdateWithoutTenantInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutTenantInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutTenantInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    tenantId?: StringNullableFilter<"ChatMessage"> | string | null
    senderId?: StringFilter<"ChatMessage"> | string
    senderName?: StringFilter<"ChatMessage"> | string
    senderType?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    isRead?: BoolFilter<"ChatMessage"> | boolean
    readAt?: DateTimeNullableFilter<"ChatMessage"> | Date | string | null
    metadata?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type PromotionUpsertWithWhereUniqueWithoutTenantInput = {
    where: PromotionWhereUniqueInput
    update: XOR<PromotionUpdateWithoutTenantInput, PromotionUncheckedUpdateWithoutTenantInput>
    create: XOR<PromotionCreateWithoutTenantInput, PromotionUncheckedCreateWithoutTenantInput>
  }

  export type PromotionUpdateWithWhereUniqueWithoutTenantInput = {
    where: PromotionWhereUniqueInput
    data: XOR<PromotionUpdateWithoutTenantInput, PromotionUncheckedUpdateWithoutTenantInput>
  }

  export type PromotionUpdateManyWithWhereWithoutTenantInput = {
    where: PromotionScalarWhereInput
    data: XOR<PromotionUpdateManyMutationInput, PromotionUncheckedUpdateManyWithoutTenantInput>
  }

  export type PromotionScalarWhereInput = {
    AND?: PromotionScalarWhereInput | PromotionScalarWhereInput[]
    OR?: PromotionScalarWhereInput[]
    NOT?: PromotionScalarWhereInput | PromotionScalarWhereInput[]
    id?: StringFilter<"Promotion"> | string
    tenantId?: StringNullableFilter<"Promotion"> | string | null
    name?: StringFilter<"Promotion"> | string
    description?: StringNullableFilter<"Promotion"> | string | null
    code?: StringFilter<"Promotion"> | string
    discountType?: StringFilter<"Promotion"> | string
    discountValue?: DecimalFilter<"Promotion"> | Decimal | DecimalJsLike | number | string
    maxUses?: IntNullableFilter<"Promotion"> | number | null
    currentUses?: IntFilter<"Promotion"> | number
    validFrom?: DateTimeFilter<"Promotion"> | Date | string
    validUntil?: DateTimeNullableFilter<"Promotion"> | Date | string | null
    planIds?: JsonNullableFilter<"Promotion">
    status?: BoolFilter<"Promotion"> | boolean
    createdAt?: DateTimeFilter<"Promotion"> | Date | string
    updatedAt?: DateTimeFilter<"Promotion"> | Date | string
  }

  export type ExpirationNotificationUpsertWithWhereUniqueWithoutTenantInput = {
    where: ExpirationNotificationWhereUniqueInput
    update: XOR<ExpirationNotificationUpdateWithoutTenantInput, ExpirationNotificationUncheckedUpdateWithoutTenantInput>
    create: XOR<ExpirationNotificationCreateWithoutTenantInput, ExpirationNotificationUncheckedCreateWithoutTenantInput>
  }

  export type ExpirationNotificationUpdateWithWhereUniqueWithoutTenantInput = {
    where: ExpirationNotificationWhereUniqueInput
    data: XOR<ExpirationNotificationUpdateWithoutTenantInput, ExpirationNotificationUncheckedUpdateWithoutTenantInput>
  }

  export type ExpirationNotificationUpdateManyWithWhereWithoutTenantInput = {
    where: ExpirationNotificationScalarWhereInput
    data: XOR<ExpirationNotificationUpdateManyMutationInput, ExpirationNotificationUncheckedUpdateManyWithoutTenantInput>
  }

  export type ExpirationNotificationScalarWhereInput = {
    AND?: ExpirationNotificationScalarWhereInput | ExpirationNotificationScalarWhereInput[]
    OR?: ExpirationNotificationScalarWhereInput[]
    NOT?: ExpirationNotificationScalarWhereInput | ExpirationNotificationScalarWhereInput[]
    id?: StringFilter<"ExpirationNotification"> | string
    tenantId?: StringFilter<"ExpirationNotification"> | string
    type?: StringFilter<"ExpirationNotification"> | string
    daysLeft?: IntNullableFilter<"ExpirationNotification"> | number | null
    sentAt?: DateTimeFilter<"ExpirationNotification"> | Date | string
    emailSent?: BoolFilter<"ExpirationNotification"> | boolean
  }

  export type SuperAdminAccessUpsertWithoutTenantInput = {
    update: XOR<SuperAdminAccessUpdateWithoutTenantInput, SuperAdminAccessUncheckedUpdateWithoutTenantInput>
    create: XOR<SuperAdminAccessCreateWithoutTenantInput, SuperAdminAccessUncheckedCreateWithoutTenantInput>
    where?: SuperAdminAccessWhereInput
  }

  export type SuperAdminAccessUpdateToOneWithWhereWithoutTenantInput = {
    where?: SuperAdminAccessWhereInput
    data: XOR<SuperAdminAccessUpdateWithoutTenantInput, SuperAdminAccessUncheckedUpdateWithoutTenantInput>
  }

  export type SuperAdminAccessUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminAccessUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLogs?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    plan?: PlanCreateNestedOneWithoutTenantsInput
    chatMessages?: ChatMessageCreateNestedManyWithoutTenantInput
    promotions?: PromotionCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessCreateNestedOneWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    planId?: string | null
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutTenantInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationUncheckedCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSubscriptionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
  }

  export type PlanCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    period?: string
    description?: string | null
    status?: boolean
    maxBarbers?: number
    maxServices?: number
    maxServiceOptions?: number
    maxBookingsPerMonth?: number
    maxBarberShops?: number
    maxStorageMB?: number
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: number
    requiresCard?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenants?: TenantCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    price: Decimal | DecimalJsLike | number | string
    period?: string
    description?: string | null
    status?: boolean
    maxBarbers?: number
    maxServices?: number
    maxServiceOptions?: number
    maxBookingsPerMonth?: number
    maxBarberShops?: number
    maxStorageMB?: number
    hasAnalytics?: boolean
    hasNotifications?: boolean
    hasCustomDomain?: boolean
    hasWhiteLabel?: boolean
    hasAPI?: boolean
    hasPrioritySupport?: boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: number
    requiresCard?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenants?: TenantUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanCreateOrConnectWithoutSubscriptionsInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutSubscriptionsInput, PlanUncheckedCreateWithoutSubscriptionsInput>
  }

  export type TenantUpsertWithoutSubscriptionsInput = {
    update: XOR<TenantUpdateWithoutSubscriptionsInput, TenantUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSubscriptionsInput, TenantUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type TenantUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneWithoutTenantsNestedInput
    chatMessages?: ChatMessageUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chatMessages?: ChatMessageUncheckedUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUncheckedUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type PlanUpsertWithoutSubscriptionsInput = {
    update: XOR<PlanUpdateWithoutSubscriptionsInput, PlanUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<PlanCreateWithoutSubscriptionsInput, PlanUncheckedCreateWithoutSubscriptionsInput>
    where?: PlanWhereInput
  }

  export type PlanUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: PlanWhereInput
    data: XOR<PlanUpdateWithoutSubscriptionsInput, PlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type PlanUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    maxBarbers?: IntFieldUpdateOperationsInput | number
    maxServices?: IntFieldUpdateOperationsInput | number
    maxServiceOptions?: IntFieldUpdateOperationsInput | number
    maxBookingsPerMonth?: IntFieldUpdateOperationsInput | number
    maxBarberShops?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    hasAnalytics?: BoolFieldUpdateOperationsInput | boolean
    hasNotifications?: BoolFieldUpdateOperationsInput | boolean
    hasCustomDomain?: BoolFieldUpdateOperationsInput | boolean
    hasWhiteLabel?: BoolFieldUpdateOperationsInput | boolean
    hasAPI?: BoolFieldUpdateOperationsInput | boolean
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: IntFieldUpdateOperationsInput | number
    requiresCard?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenants?: TenantUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    period?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    maxBarbers?: IntFieldUpdateOperationsInput | number
    maxServices?: IntFieldUpdateOperationsInput | number
    maxServiceOptions?: IntFieldUpdateOperationsInput | number
    maxBookingsPerMonth?: IntFieldUpdateOperationsInput | number
    maxBarberShops?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    hasAnalytics?: BoolFieldUpdateOperationsInput | boolean
    hasNotifications?: BoolFieldUpdateOperationsInput | boolean
    hasCustomDomain?: BoolFieldUpdateOperationsInput | boolean
    hasWhiteLabel?: BoolFieldUpdateOperationsInput | boolean
    hasAPI?: BoolFieldUpdateOperationsInput | boolean
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    features?: NullableJsonNullValueInput | InputJsonValue
    trialDays?: IntFieldUpdateOperationsInput | number
    requiresCard?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenants?: TenantUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type TenantCreateWithoutPromotionsInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    plan?: PlanCreateNestedOneWithoutTenantsInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessCreateNestedOneWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutPromotionsInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    planId?: string | null
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationUncheckedCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPromotionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPromotionsInput, TenantUncheckedCreateWithoutPromotionsInput>
  }

  export type TenantUpsertWithoutPromotionsInput = {
    update: XOR<TenantUpdateWithoutPromotionsInput, TenantUncheckedUpdateWithoutPromotionsInput>
    create: XOR<TenantCreateWithoutPromotionsInput, TenantUncheckedCreateWithoutPromotionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutPromotionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutPromotionsInput, TenantUncheckedUpdateWithoutPromotionsInput>
  }

  export type TenantUpdateWithoutPromotionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneWithoutTenantsNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutPromotionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUncheckedUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUncheckedUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantCreateWithoutChatMessagesInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    plan?: PlanCreateNestedOneWithoutTenantsInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    promotions?: PromotionCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessCreateNestedOneWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutChatMessagesInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    planId?: string | null
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationUncheckedCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutChatMessagesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutChatMessagesInput, TenantUncheckedCreateWithoutChatMessagesInput>
  }

  export type TenantUpsertWithoutChatMessagesInput = {
    update: XOR<TenantUpdateWithoutChatMessagesInput, TenantUncheckedUpdateWithoutChatMessagesInput>
    create: XOR<TenantCreateWithoutChatMessagesInput, TenantUncheckedCreateWithoutChatMessagesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutChatMessagesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutChatMessagesInput, TenantUncheckedUpdateWithoutChatMessagesInput>
  }

  export type TenantUpdateWithoutChatMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneWithoutTenantsNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutChatMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUncheckedUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantCreateWithoutExpirationNotificationsInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    plan?: PlanCreateNestedOneWithoutTenantsInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageCreateNestedManyWithoutTenantInput
    promotions?: PromotionCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessCreateNestedOneWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutExpirationNotificationsInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    planId?: string | null
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutTenantInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutTenantInput
    superAdminAccess?: SuperAdminAccessUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutExpirationNotificationsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutExpirationNotificationsInput, TenantUncheckedCreateWithoutExpirationNotificationsInput>
  }

  export type TenantUpsertWithoutExpirationNotificationsInput = {
    update: XOR<TenantUpdateWithoutExpirationNotificationsInput, TenantUncheckedUpdateWithoutExpirationNotificationsInput>
    create: XOR<TenantCreateWithoutExpirationNotificationsInput, TenantUncheckedCreateWithoutExpirationNotificationsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutExpirationNotificationsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutExpirationNotificationsInput, TenantUncheckedUpdateWithoutExpirationNotificationsInput>
  }

  export type TenantUpdateWithoutExpirationNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneWithoutTenantsNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutExpirationNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUncheckedUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantCreateWithoutSuperAdminAccessInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    plan?: PlanCreateNestedOneWithoutTenantsInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageCreateNestedManyWithoutTenantInput
    promotions?: PromotionCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSuperAdminAccessInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    planId?: string | null
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutTenantInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutTenantInput
    expirationNotifications?: ExpirationNotificationUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSuperAdminAccessInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSuperAdminAccessInput, TenantUncheckedCreateWithoutSuperAdminAccessInput>
  }

  export type TenantUpsertWithoutSuperAdminAccessInput = {
    update: XOR<TenantUpdateWithoutSuperAdminAccessInput, TenantUncheckedUpdateWithoutSuperAdminAccessInput>
    create: XOR<TenantCreateWithoutSuperAdminAccessInput, TenantUncheckedCreateWithoutSuperAdminAccessInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSuperAdminAccessInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSuperAdminAccessInput, TenantUncheckedUpdateWithoutSuperAdminAccessInput>
  }

  export type TenantUpdateWithoutSuperAdminAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneWithoutTenantsNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSuperAdminAccessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUncheckedUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type SubscriptionCreateManyPlanInput = {
    id?: string
    tenantId: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantCreateManyPlanInput = {
    id?: string
    name: string
    subdomain: string
    customDomain?: string | null
    ownerName: string
    ownerEmail: string
    ownerPhone?: string | null
    databaseName: string
    databaseUrl: string
    status?: string
    isActive?: boolean
    trialStartDate?: Date | string | null
    trialEndDate?: Date | string | null
    trialUsed?: boolean
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    currentBarbers?: number
    currentServices?: number
    currentBookingsThisMonth?: number
    currentBarberShops?: number
    currentStorageMB?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    chatMessages?: ChatMessageUncheckedUpdateManyWithoutTenantNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutTenantNestedInput
    expirationNotifications?: ExpirationNotificationUncheckedUpdateManyWithoutTenantNestedInput
    superAdminAccess?: SuperAdminAccessUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    ownerName?: StringFieldUpdateOperationsInput | string
    ownerEmail?: StringFieldUpdateOperationsInput | string
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseName?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialUsed?: BoolFieldUpdateOperationsInput | boolean
    asaasCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentBarbers?: IntFieldUpdateOperationsInput | number
    currentServices?: IntFieldUpdateOperationsInput | number
    currentBookingsThisMonth?: IntFieldUpdateOperationsInput | number
    currentBarberShops?: IntFieldUpdateOperationsInput | number
    currentStorageMB?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyTenantInput = {
    id?: string
    planId: string
    status: string
    isActive?: boolean
    startDate: Date | string
    endDate?: Date | string | null
    cancelledAt?: Date | string | null
    asaasSubscriptionId?: string | null
    paymentMethod?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    autoRenew?: boolean
    nextBillingDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatMessageCreateManyTenantInput = {
    id?: string
    senderId: string
    senderName: string
    senderType: string
    message: string
    isRead?: boolean
    readAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PromotionCreateManyTenantInput = {
    id?: string
    name: string
    description?: string | null
    code: string
    discountType: string
    discountValue: Decimal | DecimalJsLike | number | string
    maxUses?: number | null
    currentUses?: number
    validFrom: Date | string
    validUntil?: Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExpirationNotificationCreateManyTenantInput = {
    id?: string
    type: string
    daysLeft?: number | null
    sentAt?: Date | string
    emailSent?: boolean
  }

  export type SubscriptionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    asaasSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    nextBillingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    senderType?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    senderType?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderName?: StringFieldUpdateOperationsInput | string
    senderType?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    currentUses?: IntFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    currentUses?: IntFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    currentUses?: IntFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planIds?: NullableJsonNullValueInput | InputJsonValue
    status?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpirationNotificationUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    daysLeft?: NullableIntFieldUpdateOperationsInput | number | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailSent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExpirationNotificationUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    daysLeft?: NullableIntFieldUpdateOperationsInput | number | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailSent?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExpirationNotificationUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    daysLeft?: NullableIntFieldUpdateOperationsInput | number | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emailSent?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}