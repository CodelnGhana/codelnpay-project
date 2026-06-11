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
3. Collusion-Resistant Recovery: The threshold configuration ensures that no single recovery server—nor CodeLnPay itself—can unilaterally recovery an account key. A quorum of independent signatures is strictly required only during the master key replacement flow.

Included in this doc are diagrams that detail the end-to-end registration sequences for both onboarding models. 
They map out the precise user interface interactions alongside the behind-the-scenes system actions that were required 
to transition from a legacy, single-key local backup to CodeLnPay's secure, 
identity-verified multi-signature threshold configuration.
<br/>
<br/>
#### How to test (Staging Only: USE OTP, EMAIL and VERIFICATION CODE AS 123456)
1. Navigate to [CodelnPay Staging Manage Wallet ](https://pearlmine-94bec.web.app/Wallet)
- User : stellartest@cdln.com
- Password : biwrupgozxob8mojTy
- OTP : 123456
</br>
</br>
2. Create New Wallet
![manage-wallet-image]
</br>
</br>
3. SetUp recovery
![recover-wallet-image](images/recover_wallet.png)
</br>
</br>
4. NOTE: Recover Wallet - USE 123456 for both EMAIL and SMS CODE [Staging Only]
</br>
</br>
#### Diagram 1: Onboarding with Seed Phrase Generation
```mermaid
graph TD
    %% Styling Configuration
    classDef startEnd fill:#1A1F2C,stroke:#4F46E5,stroke-width:2px,color:#fff;
    classDef process fill:#2E3440,stroke:#D8DEE9,stroke-width:1px,color:#ECEFF4;
    classDef warning fill:#3B4252,stroke:#EBCB8B,stroke-width:2px,color:#EBCB8B;
    classDef system fill:#242933,stroke:#81A1C1,stroke-width:1px,color:#81A1C1;

    %% Flow Steps
    Start([User Opens App]) --> SCR1[Screen 1: Welcome Splash]
    SCR1 -->|Clicks 'Create New Wallet'| SCR2[Screen 2: App-Level Auth Setup]
    
    SCR2 -->|Enters 4-Digit PIN| SYS1[System: Register PIN]
    SYS1 --> SCR3[Screen 3: Security Acknowledgement]
    
    SCR3 -->|Accepts Mandatory Checkboxes| SYS2[System: Generate Cryptographic Seed Phrase]
    SYS2 --> SCR4[Screen 4: Reveal Seed Phrase]
    
    SCR4 -->|Taps 'I Have Written It Down'| SCR5[Screen 5: Mandatory Phrase Verification]
    
    SCR5 -->|Selects Word Chips in Order| Verification{Is Phrase Correct?}
    
    Verification -->|No: Error Notification| SCR5
    Verification -->|Yes| SYS3[System: Derive Public Stellar Address]
    
    SYS3 --> SYS4[System: Encrypt & Store Seed off App]
    SYS4 --> SCR6[Screen 6: Dashboard Activation ]
    SCR6 --> End([Onboarding Complete])

    %% Assign Styles
    class Start,End startEnd;
    class SCR1,SCR2,SCR4,SCR5,SCR6 process;
    class SCR3 warning;
    class SYS1,SYS2,SYS3,SYS4,Verification system;
```

#### Diagram 2: Onboarding with SEP30 Recovery Server SetUp


```mermaid
graph TD
    %% Styling Configuration
    classDef startEnd fill:#1A1F2C,stroke:#4F46E5,stroke-width:2px,color:#fff;
    classDef process fill:#2E3440,stroke:#D8DEE9,stroke-width:1px,color:#ECEFF4;
    classDef auth fill:#3B4252,stroke:#EBCB8B,stroke-width:2px,color:#EBCB8B;
    classDef system fill:#242933,stroke:#81A1C1,stroke-width:1px,color:#81A1C1;

    %% Flow Steps
    Start([User Opens App]) --> SCR1[Screen 1: Welcome Splash]
    SCR1 -->|Clicks 'Create Wallet'| SCR2[Screen 2: Account Identity Inputs]
    
    SCR2 -->|Enters Email & Phone| SCR3[Screen 3: Server 1 Auth - Email]
    SCR3 -->|Inputs Email OTP Code| SYS1[Server 1: Verify & Return Signer Key 1]
    
    SYS1 --> SCR4[Screen 4: Server 2 Auth - SMS]
    SCR4 -->|Inputs SMS OTP Code| SYS2[Server 2: Verify & Return Signer Key 2]
    
    SYS2 --> SYS3[System: Generate Device Master Key locally]
    SYS3 --> SYS4[System: Build Multi-Sig Threshold Transaction]
    SYS4 --> SYS5[System: Submit Transaction to Stellar Network]
    
    SYS5 --> SCR5[Screen 5: Dashboard Activation]
    SCR5 --> End([Onboarding Complete])

    %% Assign Styles
    class Start,End startEnd;
    class SCR1,SCR2,SCR5 process;
    class SCR3,SCR4 auth;
    class SYS1,SYS2,SYS3,SYS4,SYS5 system;
```
#### Diagram 3: Wallet Recovery UX Flow for a New Device Scenario
```mermaid
graph TD
    %% Styling Configuration
    classDef startEnd fill:#1A1F2C,stroke:#4F46E5,stroke-width:2px,color:#fff;
    classDef process fill:#2E3440,stroke:#D8DEE9,stroke-width:1px,color:#ECEFF4;
    classDef auth fill:#3B4252,stroke:#EBCB8B,stroke-width:2px,color:#EBCB8B;
    classDef system fill:#242933,stroke:#81A1C1,stroke-width:1px,color:#81A1C1;

    %% Flow Steps
    Start([User Installs App on New Device]) --> SCR1[Screen 1: Welcome Splash]
    SCR1 -->|Clicks 'Recover Existing Wallet'| SCR2[Screen 2: Identity Lookup]
    
    SCR2 -->|Enters Registered Email & Phone| SYS1[System: Generate New Device Key pair locally]
    SYS1 --> SCR3[Screen 3: Server 1 Challenge - Email]
    
    SCR3 -->|Inputs Email OTP Code| SYS2[Server 1: Verify Identity & Return Signature 1]
    SYS2 --> SCR4[Screen 4: Server 2 Challenge - SMS]
    
    SCR4 -->|Inputs SMS OTP Code| SYS3[Server 2: Verify Identity & Return Signature 2]
    
    SYS3 --> SYS4[System: Combine Signatures & Build Key-Replacement Tx]
    SYS4 --> SYS5[System: Submit Transaction to Stellar Network]
    
    SYS5 --> SCR5[Screen 5: Recovery Success Dashboard]
    SCR5 --> End([Wallet Fully Recovered])

    %% Assign Styles
    class Start,End startEnd;
    class SCR1,SCR2,SCR5 process;
    class SCR3,SCR4 auth;
    class SYS1,SYS2,SYS3,SYS4,SYS5 system;
```
### Wallet SetUp and Recovery Demo

[![Watch the video](https://img.youtube.com/vi/2Mm_pB9xoW4/maxresdefault.jpg)]( https://youtu.be/2Mm_pB9xoW4)


[manage-wallet-image]: images/manage_wallets.png
[recover-wallet-image]: images/recover_wallet.png
