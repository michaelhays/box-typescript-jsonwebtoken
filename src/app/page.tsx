import BoxSDK from 'box-node-sdk'
import { BoxJwtAuth, JwtConfig } from 'box-typescript-sdk-gen/lib/box/jwtAuth.generated.js'

export default function HomePage() {
  async function boxGetTokenOld() {
    'use server'

    const boxSDK = BoxSDK.getPreconfiguredInstance(
      JSON.parse(process.env.BOX_CONFIG),
    )
    const boxClient = boxSDK.getAppAuthClient('user', process.env.BOX_APP_USER_ID)

    const token = await boxClient.exchangeToken(
      ['item_preview'],
      `https://api.box.com/2.0/files/${process.env.BOX_FILE_ID}`,
    )

    console.log({ token })

    return token.accessToken
  }

  async function boxGetTokenNew() {
    'use server'

    const boxJwtConfig = JwtConfig.fromConfigJsonString(process.env.BOX_CONFIG)
    const boxJwtAuth = await new BoxJwtAuth({ config: boxJwtConfig })
      .asUser(process.env.BOX_APP_USER_ID)

    // Retrieve a token to avoid error: "No access token is available. Make an
    // API call to retrieve a token before calling this method."
    await boxJwtAuth.retrieveToken()

    const token = await boxJwtAuth.downscopeToken(
      ['item_preview'],
      `https://api.box.com/2.0/files/${process.env.BOX_FILE_ID}`,
    )

    console.log({ token })

    return token.accessToken
  }

  return (
    <main>
      <form action={boxGetTokenOld}>
        <button type="submit">box-node-sdk</button>
      </form>

      <form action={boxGetTokenNew}>
        <button type="submit">box-typescript-sdk-gen</button>
      </form>
    </main>
  );
}
