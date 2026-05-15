
# CodelnPay Account Recovery Sep30 with AWS KMS

## Overview

Stellar natively operates on the **Ed25519** cryptographic curve, whereas AWS KMS primarily manages **NIST-compliant (
e.g., Secp256r1)** curves for asymmetric signing. To bridge this gap securely, we use **Envelope Encryption**:

1. **Setup Phase:** A secondary Stellar recovery keypair is generated. The secret key (`S...`) is encrypted using an AWS
   KMS Symmetric Customer Master Key (CMK). The resulting ciphertext blob is saved securely, and the plain text key is
   destroyed.
2. **Configuration Phase:** The public key of the recovery signer is added to the user's primary Stellar account with a
   specific weight, and the account's `high_threshold` is adjusted.
3. **Recovery Phase:** If the primary master key is lost, an authorized administrator/system requests AWS KMS to decrypt
   the ciphertext. The temporary plaintext recovery key signs a `SetOptions` operation to establish a new master key on
   the Stellar account.

---

## How to test

### Prerequisites

- **Python 3.8+**
- **Dependencies:**

```bash
pip install stellar-sdk 
```
### Run Example
```python
python  sep30_example
```

### Overview
1. Account Creation
```python
def setup():
    pass
```
2. Registration
```python

```
3. Set Options
```python

```
4. Recovery Request
```python

```
5. Test Payment
```python

```

### Architechture
### System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                  CodeLnpay Mobile Client               │
│       (Holds: Device Key / Account Primary Key)        │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 1. Submits registration request
                            │ 2. Sends XDR payload to be signed
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Recovery Server API                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ► POST /accounts/add                                  │
│    └─ Registers device key & requests KMS key creation │
│                                                        │
│  ► POST /accounts/sign                                 │
│    └─ Authorizes request & asks KMS to sign the XDR    │
│                                                        │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 1a. CreateKey 
                            │ 2a. Sign (using KMS asymmetric key)
                            ▼
┌────────────────────────────────────────────────────────┐
│                        AWS KMS                         │
├────────────────────────────────────────────────────────┤
│  • Secures the Recovery Key / Secondary Signer         │
└────────────────────────────────────────────────────────┘
```
### Sep 30 TestNet Servers

1. [Server A](https://lnrec1.codeln.com)
2. [Server B](https://lnrec2.codeln.com)

