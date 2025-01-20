module.exports.generateAPIPolicy = (principalId) => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "*",
        },
      ],
    },
    context: {
      userId: principalId,
      customerAccountId: principalId,
      fullName: principalId,
      roles: "[]",
    },
  };
};
