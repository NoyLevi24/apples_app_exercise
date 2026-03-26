# 🍎 Apple Inventory Web Application

This project is a professional DevOps exercise demonstrating a complete lifecycle of a containerized Node.js & MongoDB application. It features automated infrastructure provisioning, configuration management, and a manual CI/CD pipeline.

## 🏗️ Architecture Design

The architecture is designed for modularity and high-tech best practices:
* **Application:** Node.js Express server querying a MongoDB database.
* **Database:** MongoDB instance with automated seeding via `init-db.js`.
* **Containers:** Managed by **Docker Compose** for local and remote consistency.
* **Infrastructure (IaC):** AWS VPC, Subnets, and EC2 provisioned via **Terraform**.
* **Remote State:** State management is handled by **HCP Terraform** to ensure consistency and security.
* **Configuration & Deployment:** **Ansible** configures the OS, installs Docker, and deploys the stack.
* **CI/CD:** Automated via **GitHub Actions** with a manual trigger mechanism.

### 🌐 Network Topology
* **VPC:** `10.0.0.0/16`
* **Public Subnet:** Direct access via Internet Gateway.
* **Security Group:**
    * Port `3000`: Web Traffic.
    * Port `22`: SSH for Ansible management.

---

## 🛠️ Prerequisites

To run this project, you need:
1. **AWS Account:** Credentials with administrative access.
2. **HCP Terraform Account:** A workspace configured in **Local Execution Mode**.
3. **GitHub Secrets:** The following secrets must be configured in your repository:
    * `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`
    * `TF_API_TOKEN` (From HCP Terraform)
    * `SSH_PRIVATE_KEY` (Content of your `.pem` file)

---

## 🚀 Deployment (Manual CI/CD)

This project uses a **GitOps-ready** approach where the deployment is triggered manually via GitHub Actions.

1. **Push Changes:** Ensure your code is pushed to the `main` branch.
2. **Trigger Pipeline:**
   * Go to the **Actions** tab in your GitHub repository.
   * Select the **"CI/CD Pipeline"** workflow.
   * Click **Run workflow**.
3. **Wait for Completion:**
   * **Stage 1:** Infrastructure Provisioning (Terraform Apply).
   * **Stage 2:** Configuration & App Deployment (Ansible).
5. **Access the App:** * Check the logs of the Terraform stage or the AWS Console for the Public IP.
   * Open: `http://<instance-public-ip>:3000`

---

## 🧪 Infrastructure & App Verification

* **HCP Terraform:** Monitor the state and run history in your HCP Dashboard.
* **AWS Console:** Verify the EC2 instance "Apples-Web-Server" is running.
* **Application:** The web page should display the message: **"Number of apples in the DB: 5"**.
* **Persistence:** MongoDB uses Docker volumes to ensure data survives container restarts.

---

## 🌟 Advanced Features Implemented
* **Decoupled Workflow:** Terraform manages the hardware; Ansible manages the software.
* **Remote State Management:** Used HCP Terraform to prevent state-lock and ensure team collaboration.
* **Manual Pipeline Trigger:** Implemented `workflow_dispatch` for controlled deployments.
* **Modular Codebase:** Separated Terraform into `providers`, `variables`, and `outputs`.
* **Security First:** Sensitive data is handled via GitHub Secrets; `.gitignore` prevents leaks.

---

## 🧹 Cleanup
To terminate all resources and avoid costs:
```bash
cd terraform
terraform destroy -auto-approve
```
## 🏗️ Architecture & Infrastructure

This project demonstrates a full GitOps pipeline using **HCP Terraform** for Infrastructure as Code (IaC) and **Ansible** for configuration management, all orchestrated via **GitHub Actions**.

### System Architecture Diagram

```mermaid
graph TD
    %% Define Styles
    classDef aws fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white;
    classDef network fill:#f9f,stroke:#333,stroke-width:2px;
    classDef docker fill:#2496ED,stroke:#232F3E,stroke-width:2px,color:white;
    classDef db fill:#4DB33D,stroke:#333,stroke-width:2px,color:white;
    classDef user fill:#fff,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5;

    %% Cloud Infrastructure (Terraform)
    subgraph AWS_Cloud [" AWS Cloud (Region: us-east-1) "]
        direction TB
        class AWS_Cloud aws;

        subgraph VPC [" VPC (10.0.0.0/16) "]
            direction TB
            class VPC network;

            subgraph Public_Subnet [" Public Subnet "]
                direction TB
                class Public_Subnet network;

                subgraph SG [" Security Group: apples-sg "]
                    direction TB
                    class SG aws;
                    
                    SSH_In["Inbound: Port 22 (SSH)"]:::aws
                    App_In["Inbound: Port 3000 (App)"]:::aws

                    subgraph EC2 [" EC2 Instance (t3.micro) "]
                        direction TB
                        class EC2 aws;

                        %% Configuration Management (Ansible & Docker)
                        subgraph Docker_Host [" Docker Compose Runtime "]
                            direction TB
                            class Docker_Host docker;

                            subgraph Docker_Network [" Bridge: apples-nav "]
                                direction LR
                                class Docker_Network docker;

                                App_Cont["Node.js App\n(Port 3000)"]:::docker
                                DB_Cont["MongoDB\n(Port 27017)"]:::db
                                DB_Vol[("Volume: mongo-data")]:::db

                                App_Cont <-->|"Internal Connect"| DB_Cont
                                DB_Cont --- DB_Vol
                            end
                        end
                    end
                end
            end
        end
    end

    %% External Actors & CI/CD
    User([External User]):::user
    GH_Actions([GitHub Actions CI/CD]):::user
    HCP_TF([HCP Terraform State]):::user

    %% Traffic Flows
    User ==>|"HTTP Request (Port 3000)"| App_In
    App_In ==> App_Cont
    
    GH_Actions -.->|"1. Fetch State"| HCP_TF
    GH_Actions -.->|"2. Provision Infrastructure"| AWS_Cloud
    GH_Actions ==>|"3. Configure (Ansible/SSH)"| SSH_In
