package com.med_triage_api.model;

public class BookingResponse {

  private String confirmationId;
  private String slot;
  private String recommendation;

  public BookingResponse() {
  }

  public BookingResponse(String confirmationId, String slot, String recommendation) {
    this.confirmationId = confirmationId;
    this.slot = slot;
    this.recommendation = recommendation;
  }

  public String getConfirmationId() {
    return confirmationId;
  }

  public void setConfirmationId(String confirmationId) {
    this.confirmationId = confirmationId;
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