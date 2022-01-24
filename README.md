# About

Aggregate EOA positions graph app, created by George Filippou for the SimpleFi team. Thank you for reviewing.

# Live Demo

View a live demo of this app at https://ob-test.vercel.app/ \
You are encouraged to use the Console. It logs information that makes it easy to follow how the app handles all events.

# Points To Note

### Inconsistent farms.balance type

Balance in the “farms” array is inconsinstent and may be received as either number or string type. I provided for this irregularity by converting to number type on the fly. Not sure if this was intentional but it messed up my graph if left unchecked, so I thought you might want to know.

### Connection Timeout Error

EventSource connection times out ~50 seconds after positions have completed streaming. Handled this by comparing the total expected positions received, with the number of actual positions received. Once those match, the connection is intentionally closed and timeout errors are avoided. In case of unintentional disconnect or timeout error, the app attempts to reconnect after 5 seconds.

### Future Proofing for High Data Throughput

The two EOA’s provided just have 11 positions, and each position is received at a manageable rate (one every ~2-5 seconds for me). I noticed the history data have one entry per day so, if not today in a few years, positions with many thousands of history items per LP can definintely appear. The app now aggregates and draws positions as they stream in, but this isn’t future-proof. In case of high data throughput (high stream rate, large number of positions, or positions with many thousands of history items) some kind of mechanism would be required to ensure the frontend doesn’t crash or slow down.

One such mechanism could be:

1. Push all positions in raw format to a "buffer" array as they stream in
2. Conduct calculations and update the state from this buffer array every set time interval, e.g. 3 seconds
3. Empty the buffer array after updating the state
4. Repeat 1 to 3 until the positions finish streaming

This would ensure UI stability for any client (from evergreen browsers on fast connections, to mobile devices on slow connections)

### Runtime Type Checking

To guard against type inconsistencies (like with the farms.balance) runtime type checking can be used. The TypeScript transpiler only runs during development - on a deployed app there is no more type checking by TypeScript. If the server sends a message containing data of unknown types, it will generate an error. Packages like “npm runtypes” can be added to perform real-time type checking, much like TypeScript but during the app run time (via validation schemas). This consiously wasn't used here, because:

1. For data streams, runtime type checking can potentially slow down the frontend significantly
2. The stream is owned by SimpleFi, so changes to message shape or types should be predictable

### State Management

1. Managed state via useReducer and Context provider
2. Changes mutate the state. This can be avoided with libraries like Immer or Immutable, at which point you might as well use Redux
3. No ability for time-travel debugging
4. Simple handling of async side-effects due to just one connection to a single service. Multiple connections with many services (rest, websockets, SSE eventSource) would require a more robust approach, e.g. Middleware composed into the Redux Store

# Available Scripts

### `npm start`

Runs the app at [http://localhost:3000](http://localhost:3000) \
You are encouraged to use the Console. It logs information that makes it easy to follow how the app handles all events.

### `npm test`

Runs the tests in the terminal
