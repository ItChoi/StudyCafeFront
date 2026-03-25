# 07. TypeScript 기초 (백엔드 개발자용)

## TypeScript란?

JavaScript에 **정적 타입**을 추가한 언어입니다.
Java/Kotlin처럼 컴파일 타임에 타입 오류를 잡아줍니다.

---

## 기본 타입

```ts
// 기본 타입
let name: string = '강남점';
let id: number = 1;
let isActive: boolean = true;
let tags: string[] = ['카페', '조용한'];

// null/undefined 허용
let endTime: string | null = null;  // Kotlin의 String?와 동일

// 함수 타입
function add(a: number, b: number): number {
  return a + b;
}

// 화살표 함수
const greet = (name: string): string => `안녕, ${name}`;
```

---

## interface - 객체 타입 정의

```ts
// Kotlin data class / Java record와 유사
interface Branch {
  id: number;
  name: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';  // 유니온 타입 (enum처럼 특정 값만 허용)
}

// 사용
const branch: Branch = {
  id: 1,
  name: '강남점',
  address: '서울 강남구',
  status: 'ACTIVE',
};
```

---

## 제네릭 (Generics)

Java/Kotlin의 제네릭과 동일합니다.

```ts
// Kotlin: fun <T> ApiResponse<T>(data: T)
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// 사용
const branchResponse: ApiResponse<Branch> = { success: true, data: branch };
const listResponse: ApiResponse<Branch[]> = { success: true, data: [branch] };
```

---

## 선택적 속성 (Optional)

```ts
interface BranchPass {
  id: number;
  name: string;
  minutes?: number;  // ?는 있을 수도, 없을 수도 있음 (Kotlin의 Int? 와 유사)
  days?: number;
}

// 접근 시 null 체크
const minutes = pass.minutes ?? 0;     // null이면 0
const days = pass.days?.toString();    // null이면 undefined (옵셔널 체이닝)
```

---

## 타입 단언 및 Non-null 단언

```ts
// as - 타입 강제 변환 (Kotlin의 as와 유사, 위험하므로 최소화)
const id = someValue as number;

// ! - null이 절대 아님을 단언 (Kotlin의 !! 와 유사, 신중하게 사용)
const element = document.getElementById('root')!;
```

---

## 유용한 유틸리티 타입

```ts
// Partial<T> - 모든 속성을 선택적으로
type UpdateBranch = Partial<Branch>;
// { id?: number; name?: string; ... }

// Omit<T, K> - 특정 속성 제외
type CreateBranch = Omit<Branch, 'id'>;
// { name: string; address: string; ... }

// Pick<T, K> - 특정 속성만 선택
type BranchSummary = Pick<Branch, 'id' | 'name'>;
// { id: number; name: string }
```

---

## React에서 타입 사용

```tsx
// Props 타입 정의
interface Props {
  branch: Branch;
  onSelect?: (branch: Branch) => void;  // 선택적 콜백
}

function BranchCard({ branch, onSelect }: Props) {
  return (
    <div onClick={() => onSelect?.(branch)}>
      {branch.name}
    </div>
  );
}

// useState 타입
const [branches, setBranches] = useState<Branch[]>([]);
const [selected, setSelected] = useState<Branch | null>(null);

// 이벤트 타입
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};
```

---

## TypeScript 컴파일 에러 해결

**"Type 'string' is not assignable to type 'number'"**
```ts
// URL 파라미터는 항상 string
const { branchId } = useParams(); // branchId: string
const id = Number(branchId);      // number로 변환
```

**"Object is possibly 'null' or 'undefined'"**
```ts
// null 체크 먼저
if (!member) return;
console.log(member.name); // 이제 안전

// 또는 옵셔널 체이닝
console.log(member?.name);
```

**"Property does not exist on type"**
```ts
// interface에 해당 속성 추가 필요
interface Branch {
  // 빠진 속성 추가
  phoneNumber: string;
}
```
