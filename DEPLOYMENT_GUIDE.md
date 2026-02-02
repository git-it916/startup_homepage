# K-Destiny AWS 배포 가이드

## 목차
1. [IAM 사용자 생성 및 권한 설정](#1-iam-사용자-생성-및-권한-설정)
2. [EC2 키페어 생성](#2-ec2-키페어-생성)
3. [Terraform 실행](#3-terraform-실행)
4. [GitHub Secrets 설정](#4-github-secrets-설정)
5. [배포 확인](#5-배포-확인)

---

## 1. IAM 사용자 생성 및 권한 설정

### 1-1. AWS 콘솔 로그인
1. 브라우저에서 https://console.aws.amazon.com 접속
2. 루트 계정 또는 관리자 계정으로 로그인

### 1-2. IAM 서비스로 이동
1. 상단 검색창에 `IAM` 입력
2. 검색 결과에서 **IAM** 클릭

### 1-3. 정책 생성
1. 왼쪽 메뉴에서 **정책(Policies)** 클릭
2. 오른쪽 상단 **정책 생성(Create policy)** 버튼 클릭
3. **JSON** 탭 클릭
4. 기존 내용 모두 삭제
5. 아래 JSON 복사하여 붙여넣기:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRFullAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetRepositoryPolicy",
        "ecr:DescribeRepositories",
        "ecr:ListImages",
        "ecr:DescribeImages",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage",
        "ecr:CreateRepository",
        "ecr:DeleteRepository"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EC2Access",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeImages",
        "ec2:DescribeKeyPairs",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs",
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeInternetGateways",
        "ec2:DescribeRouteTables",
        "ec2:DescribeAddresses",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DescribeVpcAttribute",
        "ec2:DescribeInstanceTypes",
        "ec2:DescribeInstanceAttribute",
        "ec2:DescribeVolumes",
        "ec2:DescribeTags",
        "ec2:CreateVpc",
        "ec2:DeleteVpc",
        "ec2:ModifyVpcAttribute",
        "ec2:CreateSubnet",
        "ec2:DeleteSubnet",
        "ec2:CreateInternetGateway",
        "ec2:DeleteInternetGateway",
        "ec2:AttachInternetGateway",
        "ec2:DetachInternetGateway",
        "ec2:CreateRouteTable",
        "ec2:DeleteRouteTable",
        "ec2:CreateRoute",
        "ec2:DeleteRoute",
        "ec2:AssociateRouteTable",
        "ec2:DisassociateRouteTable",
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "ec2:StopInstances",
        "ec2:StartInstances",
        "ec2:AllocateAddress",
        "ec2:ReleaseAddress",
        "ec2:AssociateAddress",
        "ec2:DisassociateAddress",
        "ec2:CreateTags",
        "ec2:DeleteTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMAccess",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:PassRole",
        "iam:ListRolePolicies",
        "iam:ListAttachedRolePolicies",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:GetRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:CreateInstanceProfile",
        "iam:DeleteInstanceProfile",
        "iam:GetInstanceProfile",
        "iam:AddRoleToInstanceProfile",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:ListInstanceProfilesForRole"
      ],
      "Resource": "*"
    }
  ]
}
```

6. 하단 **다음(Next)** 버튼 클릭
7. **정책 이름(Policy name)** 입력: `K-Destiny-Deploy-Policy`
8. **정책 생성(Create policy)** 버튼 클릭

### 1-4. IAM 사용자 생성
1. 왼쪽 메뉴에서 **사용자(Users)** 클릭
2. 오른쪽 상단 **사용자 생성(Create user)** 버튼 클릭
3. **사용자 이름(User name)** 입력: `k-destiny-deployer`
4. **다음(Next)** 버튼 클릭

### 1-5. 권한 연결
1. **직접 정책 연결(Attach policies directly)** 선택
2. 검색창에 `K-Destiny-Deploy-Policy` 입력
3. 방금 만든 정책 체크박스 선택
4. **다음(Next)** 버튼 클릭
5. **사용자 생성(Create user)** 버튼 클릭

### 1-6. Access Key 생성
1. 생성된 사용자 이름 `k-destiny-deployer` 클릭
2. **보안 자격 증명(Security credentials)** 탭 클릭
3. **액세스 키(Access keys)** 섹션에서 **액세스 키 만들기(Create access key)** 클릭
4. **Command Line Interface(CLI)** 선택
5. 하단 체크박스 "위의 권장 사항을 이해했으며..." 체크
6. **다음(Next)** 버튼 클릭
7. **액세스 키 만들기(Create access key)** 버튼 클릭
8. **⚠️ 중요: Access Key ID와 Secret Access Key를 복사하여 안전한 곳에 저장!**
   - `.env` 파일에 저장:
   ```
   AWS_ACCESS_KEY_ID=여기에_Access_Key_ID_붙여넣기
   AWS_SECRET_ACCESS_KEY=여기에_Secret_Access_Key_붙여넣기
   ```
9. **완료(Done)** 버튼 클릭

---

## 2. EC2 키페어 생성

### 2-1. EC2 서비스로 이동
1. 상단 검색창에 `EC2` 입력
2. 검색 결과에서 **EC2** 클릭

### 2-2. 리전 확인
1. 오른쪽 상단에서 리전이 **아시아 태평양 (서울) ap-northeast-2** 인지 확인
2. 다른 리전이면 클릭하여 **아시아 태평양 (서울)** 선택

### 2-3. 키페어 생성
1. 왼쪽 메뉴에서 **네트워크 및 보안** → **키 페어(Key Pairs)** 클릭
2. 오른쪽 상단 **키 페어 생성(Create key pair)** 버튼 클릭
3. 설정 입력:
   - **이름(Name)**: `k-destiny-key`
   - **키 페어 유형(Key pair type)**: `RSA` 선택
   - **프라이빗 키 파일 형식(Private key file format)**: `.pem` 선택
4. **키 페어 생성(Create key pair)** 버튼 클릭
5. **⚠️ 중요: `k-destiny-key.pem` 파일이 자동 다운로드됨 - 안전한 곳에 보관!**

---

## 3. Terraform 실행

### 3-1. 터미널에서 프로젝트 폴더로 이동
```bash
cd "c:\Users\shins\OneDrive\문서\VS_sidePJ\startup_homepage"
```

### 3-2. terraform.tfvars 파일 생성
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

### 3-3. terraform.tfvars 파일 편집
파일을 열어서 아래와 같이 수정:
```hcl
aws_region        = "ap-northeast-2"
app_name          = "k-destiny"
ec2_instance_type = "t3.micro"
ec2_key_name      = "k-destiny-key"
```

### 3-4. 환경변수 설정

**Windows PowerShell:**
```powershell
$env:AWS_ACCESS_KEY_ID="your_access_key_here"
$env:AWS_SECRET_ACCESS_KEY="your_secret_key_here"
```

**Windows CMD:**
```cmd
set AWS_ACCESS_KEY_ID=your_access_key_here
set AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

**Mac/Linux:**
```bash
export AWS_ACCESS_KEY_ID="your_access_key_here"
export AWS_SECRET_ACCESS_KEY="your_secret_key_here"
```

### 3-5. Terraform 초기화
```bash
terraform init
```
✅ 성공 메시지: "Terraform has been successfully initialized!"

### 3-6. Terraform 계획 확인
```bash
terraform plan
```
- 생성될 리소스 목록 확인
- 오류가 없는지 확인

### 3-7. Terraform 적용
```bash
terraform apply
```
1. `Do you want to perform these actions?` 메시지가 나타나면
2. `yes` 입력 후 Enter

### 3-8. 출력값 확인 및 저장
Terraform 완료 후 출력되는 값들을 저장:
```
Outputs:

app_url = "http://xx.xx.xx.xx"
ec2_instance_id = "i-xxxxxxxxxx"
ec2_public_ip = "xx.xx.xx.xx"        ← 이 IP 주소 저장!
ecr_repository_url = "xxxx.dkr.ecr.ap-northeast-2.amazonaws.com/k-destiny"
```

---

## 4. GitHub Secrets 설정

### 4-1. GitHub 저장소로 이동
1. 브라우저에서 GitHub 저장소 페이지 열기
2. 저장소가 없다면:
   - GitHub에서 **New repository** 클릭
   - Repository name: `k-destiny` (또는 원하는 이름)
   - **Create repository** 클릭

### 4-2. 로컬 저장소 연결 (저장소가 새로 만든 경우)
```bash
cd "c:\Users\shins\OneDrive\문서\VS_sidePJ\startup_homepage"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 4-3. Secrets 페이지로 이동
1. GitHub 저장소 페이지 상단에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Secrets and variables** 클릭
3. **Actions** 클릭

### 4-4. Secret 추가하기

각 Secret에 대해 다음 과정 반복:

1. **New repository secret** 버튼 클릭
2. **Name**과 **Secret** 입력
3. **Add secret** 버튼 클릭

추가할 Secrets:

| Name | Secret 값 |
|------|----------|
| `AWS_ACCESS_KEY_ID` | IAM에서 복사한 Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | IAM에서 복사한 Secret Access Key |
| `EC2_HOST` | Terraform 출력의 `ec2_public_ip` 값 (예: `13.125.xxx.xxx`) |
| `EC2_SSH_KEY` | `k-destiny-key.pem` 파일 전체 내용 복사하여 붙여넣기 |

#### EC2_SSH_KEY 입력 방법:
1. 다운로드 받은 `k-destiny-key.pem` 파일을 메모장으로 열기
2. 전체 내용 복사 (Ctrl+A → Ctrl+C)
   ```
   -----BEGIN RSA PRIVATE KEY-----
   MIIEowIBAAKCAQEA...
   ...
   -----END RSA PRIVATE KEY-----
   ```
3. GitHub Secret의 **Secret** 필드에 붙여넣기

---

## 5. 배포 확인

### 5-1. 첫 배포 실행
1. 코드 수정 후 커밋 & 푸시:
```bash
git add .
git commit -m "Deploy to AWS"
git push origin main
```

2. 또는 GitHub에서 수동 실행:
   - GitHub 저장소 → **Actions** 탭 클릭
   - 왼쪽에서 **Deploy to AWS** 클릭
   - 오른쪽 **Run workflow** 버튼 클릭
   - **Run workflow** 버튼 클릭

### 5-2. 배포 상태 확인
1. GitHub 저장소 → **Actions** 탭 클릭
2. 실행 중인 워크플로우 클릭
3. 각 단계별 로그 확인 가능
4. ✅ 모든 단계가 녹색 체크되면 성공!

### 5-3. 웹사이트 접속
1. 브라우저에서 Terraform 출력의 `app_url` 접속
   - 예: `http://13.125.xxx.xxx`
2. K-Destiny 웹사이트가 표시되면 성공!

---

## 문제 해결

### Terraform 오류 시
```bash
terraform destroy  # 모든 리소스 삭제
terraform apply    # 다시 생성
```

### EC2 연결 확인
```bash
ssh -i "k-destiny-key.pem" ec2-user@EC2_PUBLIC_IP
```

### 수동 배포 (EC2에서)
```bash
ssh -i "k-destiny-key.pem" ec2-user@EC2_PUBLIC_IP
./deploy.sh
```

### Docker 로그 확인
```bash
ssh -i "k-destiny-key.pem" ec2-user@EC2_PUBLIC_IP
docker logs k-destiny
```

---

## 리소스 삭제 (비용 절감)

사용하지 않을 때 리소스 삭제:
```bash
cd terraform
terraform destroy
```
`yes` 입력하여 모든 AWS 리소스 삭제
