package com.med_triage_api.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class AssessmentRequest {

  @Min(value = 5, message = "Score must be at least 5")
  @Max(value = 15, message = "Score must be at most 15")
  private int score;

  public AssessmentRequest() {
  }

  public AssessmentRequest(int score) {
    this.score = score;
  }

  public int getScore() {
    return score;
  }

  public void setScore(int score) {
    this.score = score;
  }
}