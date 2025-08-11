class PromiseSimple {
	constructor(executionFunction) {
		this.promiseChain = [];
		this.handleError = () => {};

		this.onResolve = this.onResolve.bind(this);
		this.onReject = this.onReject.bind(this);

		executionFunction(this.onResolve, this.onReject);
	}

	then(handleSuccess) {
		this.promiseChain.push(handleSuccess);
		return this;
	}

	catch(handleError) {
		this.handleError = handleError;
		return this;
	}

	onResolve(value) {
		let storedValue = value;

		try {
			this.promiseChain.forEach((nextFunction) => {
				storedValue = nextFunction(storedValue);
			});
		} catch (error) {
			this.promiseChain = [];
			this.onReject(error);
		}
	}

	onReject(error) {
		this.handleError(error);
	}
}

fakeApiBackend = () => {
	const user = {
		username: 'Harshwardhan',
		favouriteNum: 42,
		profile: '#'
	}

	if(Math.random() > 0.05) {
		return {
			data: user,
			statusCode: 200
		};
	} else {
		const error = {
			statusCode: 404,
			message: 'User Not Found',
			error: 'Not found'
		};

		return error;
	}
};

// Assume this is your Ajax library. Almost all newer
// ones return a Promise Object
const makeApiCall = () => {
	return new PromiseSimple((resolve, reject) => {
		 // Use a timeout to simulate the network delay waiting for the response.
		 // This is THE reason you use a promise. It waits for the API to respond
		 // and after received, it executes code in the `then()` blocks in order.
		 // If it executed is immediately, there would be no data.
		setTimeout(() => {
			const apiResponse = fakeApiBackend();

			if(apiResponse.statusCode > 400) {
				reject(apiResponse);
			} else {
				resolve(apiResponse.data);
			}
		}, 6000);
	});
};

makeApiCall()
	.then((user) => {
		console.log('In the first .then()');
		return user;
	})
	.then((user) => {
		console.log(`The user ${user.username} and my favourite number is ${user.favouriteNum}`);
		return user;
	})
	.then((user) => {
		console.log('The previous .then() told favourite number');
		return user.profile;
	})
	.then((profile) => {
		console.log(`This profile URL is ${profile}`);
		return user;
	})
	.then(() => {
		console.log('This is last .then');
	})
	.catch((error) => {
		console.log(error.message);
	})