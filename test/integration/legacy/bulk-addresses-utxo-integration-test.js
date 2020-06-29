/* eslint-disable max-len */
import { expect } from 'chai'
// import shuffle from 'shuffle-array'
import { runInServer, assertOnResults } from '../test-utils'

const ENDPOINT = '/bulk/addresses/utxo'

describe('UtxoForAddresses endpoint', () => {
  it('should return left if addresses are empty', async () =>
    runInServer(api =>
      api
        .post(ENDPOINT)
        .send()
        .expectBody({ Left: 'Addresses request length should be (0, 50]' })
        .end(),
    ))

  it('should return left if an address is invalid', async () =>
    runInServer(api =>
      api
        .post(ENDPOINT)
        .send([
          'InvalidDdzFFzCqrhshvqw9GrHmSw6ySwViBj5cj2njWj5mbnLu4uNauJCKuXhHS3wNUoGRNBGGTkyTFDQNrUWMumZ3mxarAjoXiYvyhead7yKQ',
          'DdzFFzCqrhshvqw9GrHmSw6ySwViBj5cj2njWj5mbnLu4uNauJCKuXhHS3wNUoGRNBGGTkyTFDQNrUWMumZ3mxarAjoXiYvyhead7yKQ',
        ])
        .expectBody({ Left: 'Invalid Cardano address!' })
        .end(),
    ))

  it('should return empty if addresses do not exist', async () =>
    runInServer(api =>
      api
        .post(ENDPOINT)
        .send([
          'DdzFFzCqrhshvqw9GrHmSw6ySwViBj5cj2njWj5mbnLu4uNauJCKuXhHS3wNUoGRNBGGTkyTFDQNrUWMumZ3mxarAjoXiYvyhead7yKQ',
          'DdzFFzCqrhshvqw9GrHmSw6ySwViBj5cj2njWj5mbnLu4uNauJCKuXhHS3wNUoGRNBGGTkyTFDQNrUWMumZ3mxarAjoXiYvyhead7yKQ',
        ])
        .expectBody({ Right: [] })
        .end(),
    ))

  it('should return data for addresses balance once even if sent twice', async () => {
    const usedAddresses = [
      'DdzFFzCqrhsoavpTFBhT1EAo2dDbEr7CcS1925uCTqFbT1B81NdRZcaKM4tyrDfm29iYCym8FJo4BdvSM6rFtmgUCXq6Q8vz718niXp3',
      'DdzFFzCqrhsoavpTFBhT1EAo2dDbEr7CcS1925uCTqFbT1B81NdRZcaKM4tyrDfm29iYCym8FJo4BdvSM6rFtmgUCXq6Q8vz718niXp3',
    ]

    const expectedUTOXs = [{
      tag: 'CUtxo',
      cuId:
        '\\xea8b8577cb8c4b0e88bee2ff29b4b512fe6469623edb470266e8f78ed6b00322',
      cuOutIndex: 1,
      cuAddress:
        'DdzFFzCqrhsoavpTFBhT1EAo2dDbEr7CcS1925uCTqFbT1B81NdRZcaKM4tyrDfm29iYCym8FJo4BdvSM6rFtmgUCXq6Q8vz718niXp3',
      cuCoins: { getCoin: '10000000' },
    },
    {
      tag: 'CUtxo',
      cuId:
        '\\x0ad85f6b0738d5ac3b02216c36b62b4d8ffc5d079aff4324d97744aa16cab8ea',
      cuOutIndex: 1,
      cuAddress:
        'DdzFFzCqrhsoavpTFBhT1EAo2dDbEr7CcS1925uCTqFbT1B81NdRZcaKM4tyrDfm29iYCym8FJo4BdvSM6rFtmgUCXq6Q8vz718niXp3',
      cuCoins: { getCoin: '330580600000' },
    }]

    return runInServer(api =>
      api
        .post(ENDPOINT)
        .send(usedAddresses)
        .expect(
          assertOnResults((res, { Right }) => {
            expect(Right).to.have.same.deep.members(expectedUTOXs)
          }),
        )
        .end(),
    )
  })

//   it('should filter unused addresses', async () => {
//     const usedAddresses = [
//       'DdzFFzCqrhshvqw9GrHmSw6ySwViBj5cj2njWj5mbnLu4uNauJCKuXhHS3wNUoGRNBGGTkyTFDQNrUWMumZ3mxarAjoXiYvyhead7yKQ',
//       'DdzFFzCqrhskrzzPrXynkZ3gteGy8GmWYrswqz9SueoFP9PV5suFnGv9sQqg3o5pxzFpDTJ2HFJzHrThxBYarQi8guzMUhuiePB1T6ff',
//     ]

//     const unusedAddresses = [
//       'DdzFFzCqrhsfYMUNRxtQ5NNKbWVw3ZJBNcMLLZSoqmD5trHHPBDwsjonoBgw1K6e8Qi8bEMs5Y62yZfReEVSFFMncFYDUHUTMM436KjQ',
//       'DdzFFzCqrht4s7speawymCPkm9waYHFSv2zwxhmFqHHQK5FDFt7fd9EBVvm64CrELzxaRGMcygh3gnBrXCtJzzodvzJqVR8VTZqW4rKJ',
//       'DdzFFzCqrht8d5FeU62PpBw1e3JLUP48LKfDfNtUyfuBJjBEqmgfYpwcbNHCh3csA4DEzu7SYquoUdmkcknR1E1D6zz5byvpMx632VJx',
//     ]

//     const expectedUTOXs = [
//       {
//         utxo_id:
//           '6cc6d736e3a4395acabfae4c7cfe409b65d8c7c6bbf9ff85a0bd4a95334b7a5f0',
//         tx_hash:
//           '6cc6d736e3a4395acabfae4c7cfe409b65d8c7c6bbf9ff85a0bd4a95334b7a5f',
//         tx_index: 0,
//         receiver:
//           'DdzFFzCqrhshvqw9GrHmSw6ySwViBj5cj2njWj5mbnLu4uNauJCKuXhHS3wNUoGRNBGGTkyTFDQNrUWMumZ3mxarAjoXiYvyhead7yKQ',
//         amount: '1463071700828754',
//       },
//       {
//         utxo_id:
//           'aba9ad6b8360542698038dea31ca23037ad933c057abc18c5c17c2c63dbc3d131',
//         tx_hash:
//           'aba9ad6b8360542698038dea31ca23037ad933c057abc18c5c17c2c63dbc3d13',
//         tx_index: 1,
//         receiver:
//           'DdzFFzCqrhskrzzPrXynkZ3gteGy8GmWYrswqz9SueoFP9PV5suFnGv9sQqg3o5pxzFpDTJ2HFJzHrThxBYarQi8guzMUhuiePB1T6ff',
//         amount: '9829100',
//       },
//     ]

//     const addresses = shuffle(usedAddresses.concat(unusedAddresses))
//     return runInServer(api =>
//       api
//         .post(ENDPOINT)
//         .send({ addresses })
//         .expect(
//           assertOnResults((res, body) => {
//             expect(body).to.have.same.deep.members(expectedUTOXs)
//           }),
//         )
//         .end(),
//     )
//   })
})
