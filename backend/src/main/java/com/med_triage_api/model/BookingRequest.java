package com.med_triage_api.model;

import jakarta.validation.constraints.NotBlank;

public class BookingRequest {

  @NotBlank
  private String slot;

  @NotBlank
  private String recommendation;

  public BookingRequest() {
  }

  public String getSlot() {
    return slot;
  }

  public void setSlot(String slot) {
    this.slot = slot;
  }

  public String getRecommendation() {
    return recommendation;
  }

  public void setRecommendation(String recommendation) {
    this.recommendation = recommendation;
  }
}