# ILS Survey Question List API 구현 문서

## 개요
SeniorVibe ILS(어깨 기능 평가) 설문조사 시스템에서 질문 목록을 조회하는 API를 구현했습니다.

## 구현 내용

### 1. 질문 목록 응답 DTO 추가
**파일**: `src/main/java/kr/co/seniorvibe/domains/ILS/dto/ILSQuestionListResponse.java`

```java
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ILSQuestionListResponse {
    private List<QuestionDto> questions;
    private int totalCount;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionDto {
        private Long id;
        private String questionTextKo;
        private String questionTextEn;
        private String questionTextJp;
        private String source;
        private String subjectiveMemo;
        private String memo;
    }
}
```

### 2. API 엔드포인트 추가
**파일**: `src/main/java/kr/co/seniorvibe/domains/ILS/controller/ILSServeyController.java`

```java
@GetMapping(ILS_QUESTIONS)
@ResponseStatus(HttpStatus.OK)
@Operation(summary = "ILS 설문 질문 목록 조회", description = "ILS 설문조사의 모든 질문 목록을 조회합니다.")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "질문 목록 조회 성공"),
    @ApiResponse(responseCode = "500", description = "서버 내부 오류")
})
@PreAuthorize("permitAll()")
public BaseResponse<ILSQuestionListResponse> getQuestionList() {
    ILSQuestionListResponse response = iLSServeryService.getQuestionList();
    log.info("ILS 설문 질문 목록 조회 API 호출: {}개 질문", response.getTotalCount());
    return new BaseResponse<>(response);
}
```

### 3. 서비스 메서드 구현
**파일**: `src/main/java/kr/co/seniorvibe/domains/ILS/service/ILSServeryService.java`

```java
@Transactional(readOnly = true)
public ILSQuestionListResponse getQuestionList() {
    log.info("ILS 설문 질문 목록 조회 시작");

    List<ILSServeyQuestion> questions = ilsServeyQuestionRepository.findAll();

    List<ILSQuestionListResponse.QuestionDto> questionDtos = questions.stream()
            .map(this::convertToQuestionDto)
            .collect(Collectors.toList());

    ILSQuestionListResponse response = ILSQuestionListResponse.builder()
            .questions(questionDtos)
            .totalCount(questionDtos.size())
            .build();

    log.info("ILS 설문 질문 목록 조회 완료: {}개 질문", questionDtos.size());
    return response;
}

private ILSQuestionListResponse.QuestionDto convertToQuestionDto(ILSServeyQuestion question) {
    return ILSQuestionListResponse.QuestionDto.builder()
            .id(question.getId())
            .questionTextKo(question.getQuestionTextKo())
            .questionTextEn(question.getQuestionTextEn())
            .questionTextJp(question.getQuestionTextJp())
            .source(question.getSource())
            .subjectiveMemo(question.getSubjectiveMemo())
            .memo(question.getMemo())
            .build();
}
```

### 4. URI 상수 추가
**파일**: `src/main/java/kr/co/seniorvibe/common/constant/Uris.java`

```java
public static final String ILS_QUESTIONS = ILS_ROOT + "/questions";
```

그리고 `PERMIT_ALL_URIS`와 `NOT_AUTHENTICATE_URIS` 배열에도 추가하여 인증 없이 접근 가능하도록 설정했습니다.

## API 사용법

### 요청
```http
GET /api/v1/ils/questions
```

### 응답 예시
```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "요청에 성공하였습니다.",
  "result": {
    "questions": [
      {
        "id": 1,
        "questionTextKo": "팔을 머리 위로 충분히 들어 올려 높은 선반의 물건을 놓거나 잡을 수 있다.",
        "questionTextEn": "I can raise my arm high enough to place or grab objects from a high shelf.",
        "questionTextJp": "腕を頭上まで十分に上げて、高い棚の物を置いたり取ったりできる。",
        "source": "SPADI 장애 지수",
        "subjectiveMemo": "높은 선반 동작; 어깨 전방굴곡/외전 가동범위 평가",
        "memo": "유연성 평가 문항"
      }
      // ... 총 15개 질문
    ],
    "totalCount": 15
  }
}
```

## 기존 구현 활용 내용

### 1. 엔티티 활용
- `ILSServeyQuestion.java`: 기존에 잘 정의된 엔티티 구조 활용
- BaseEntity 상속으로 생성/수정 시간 자동 관리

### 2. 시드 데이터 활용
- `ILSQuestionSeedDataService.java`: 15개의 어깨 기능 평가 질문이 이미 정의되어 있어 그대로 활용

### 3. 레포지토리 활용
- `ILSServeyQuestionRepository.java`: JpaRepository 인터페이스 활용

### 4. 보안 설정 활용
- 기존 `@PreAuthorize("permitAll()")` 패턴 활용
- URI 보안 배열 구조 활용

## 질문 내용 (총 15개)

1. **어깨 가동범위 평가 (6문항)**
   - 높은 선반 동작
   - 등 씻기/속옷 후크
   - 머리감기/빗기
   - 외투 탈착
   - 뒷주머니 접근

2. **어깨 근력 평가 (3문항)**
   - 5kg 물건 들기
   - 무거운 장바구니 운반
   - 벽 밀기 동작

3. **일상 기능 평가 (2문항)**
   - 벽 밀기 팔굽혀펴기
   - 하루 종일 활동 지속

4. **통증 평가 (4문항)**
   - 야간 통증
   - 머리 위 동작 통증
   - 내회전 동작 통증
   - 측와위 통증
   - 지속적 통증 강도

각 질문은 한국어, 영어, 일본어로 제공되며 출처와 평가 메모가 포함되어 있습니다.

## 삭제된 코드
기존 구현에서 불필요하거나 사용하지 않는 코드는 발견되지 않았습니다. 모든 기존 코드가 현재 사용되고 있어 삭제한 내용은 없습니다.

## 구현 완료 시점
2025-11-19에 ILS 설문조사 질문 목록 조회 API 구현이 완료되었습니다.



1. 하단 설문 시작 플로팅으로 하단 고정
2. 너무 어색한 ui들 수정(특히 상단 언어 선택 바)
3. 마지막 화면 개인정보 입력 창 삭제
4. 마지막 결과 화면에 이미지로 저장버튼 추가
