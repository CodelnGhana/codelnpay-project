## Phase 2: UX Recovery Process

### Overview

In this phase, the CodeLnPay Onboarding Infrastructure is upgraded to natively support automated recovery signer setup,
successfully transitioning the platform from a single-point-of-failure storage model to a decentralized recovery framework.
This infrastructure overhaul completely removes the user-experience friction and operational risks associated with manual seed phrase management. 
In its place, CodeLnPay deploys a secure, on-chain multi-signature threshold matrix that abstracts complexity away from the 
user while enforcing strict security boundaries. 
At the moment of registration, the CodeLnpay coordinates with the recovery servers to establish multi-party signing authorization.
#### Core Architectural Enhancements:
1. Decentralized Identity Anchoring: Rather than forcing users to secure physical paper backups, account recovery capability is bound securely to verified, out-of-band identity protocols (Email and SMS One-Time Passwords) processed directly by isolated recovery servers. 
2. Algorithmic Threshold Enforcement: The system automatically configures the Stellar account's signing matrix during initialization. By tuning  operation weights (assigning a dominant weight to the local device key and secondary weights to individual recovery servers), the local device handles day-to-day transaction signing seamlessly on its own. 
3. Collusion-Resistant Recovery: The threshold configuration ensures that no single recovery server - nor CodeLnPay itself - can unilaterally recovery an account key. A quorum of independent signatures is strictly required during the master key replacement flow.


#### How to test (Staging Only: USE OTP, EMAIL and VERIFICATION CODE AS 123456)
### Access our staging using the [Link](https://pearlmine-94bec.web.app/Wallet)
- Email : stellartest@cdln.com
- Password : biwrupgozxob8mojTy
- OTP : 123456

1. Click **'SetUp Wallet'**
![setup_wallet]

2. Click **‘Create New Wallet’**
![create_wallet]

3. Ensure you copy **‘Secret Key**’ using the icon. Click and scroll down to the end of Disclaimer then go ahead and click the check boxes.
![secret_key1]
4. Click **‘Manage’** or **‘Manage Wallets’**
![manage_wallet]
5. Click **‘Setup Recovery’**
![setup_recovery]
6. Add email: stellartest@cdln.com and any phone number to proceed
![enter_email]
7. Input your **‘Secret Key’** and **‘Activate Recovery’**
![secret_key2]

8. Go to dashboard and click **‘Manage Wallets'** and then **'Recover Access'**
![recover_access]
9. Enter code: **‘123456’** for Email & SMS
![enter_otp]
10. Copy your new **‘Secret Key’**, check the checkbox and then click **‘Access My Wallet’**
![recover_wallet]

[setup_wallet]: images/setup_wallet.png
[create_wallet]: images/create_wallet.png
[secret_key1]: images/secret_key_1.png
[manage_wallet]: images/manage_wallet.png
[setup_recovery]: images/setup_recovery.png
[enter_email]: images/enter_email.png
[enter_otp]: images/enter_otp.png
[secret_key2]: images/secret_key_2.png
[secret_key2]: images/secret_key_2.png
[recover_access]: images/recover_access.png
[recover_wallet]: images/recover_wallet.png

