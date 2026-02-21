package com.med_triage_api.model;

import java.util.List;

public class AssessmentResponse {

  private String recommendation;
  private List<String> availableSlots;

  public AssessmentResponse() {
  }

  public AssessmentResponse(String recommendation, List<String> availableSlots) {
    this.recommendation = recommendation;
    this.availableSlots = availableSlots;
  }

  public String getRecommendation() {
    return recommendation;
  }

  public void setRecommendation(String recommendation) {
    this.recommendation = recommendation;
  }

  public List<String> getAvailableSlots() {
    return availableSlots;
  }

  public void setAvailableSlots(List<String> availableSlots) {
    this.availableSlots = availableSlots;
  }
}