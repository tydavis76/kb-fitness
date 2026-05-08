# **Workout Programming Schema: Implementation Guide V2**

This document serves as the updated technical reference for the Workout Schema. This version (V2) introduces an analytic-friendly "Load" structure to support automated volume tracking and progress dashboards.

## **1\. Core Architecture: The Flattened Block Model**

The schema follows a flattened composition model. Each session object is a self-contained unit of data. This ensures that every workout is portable, searchable, and resilient to changes in external global templates.

### **Hierarchy Levels:**

* **Session Metadata:** High-level context (Environment, Tags, Title).  
* **Blocks:** Logical groupings of exercises (Supersets, Circuits, AMRAPs).  
* **Exercise Instances:** The specific movement, equipment, and execution rules.

## **2\. Analytic-Friendly Load Mapping**

To support progress tracking and volume calculation (Sets x Reps x Weight), the load field is structured as an object rather than a simple string.

| Field | Type | Description   |
| :---- | :---- | :---- |
| value | Number (Optional) | The numeric portion for math (e.g., 45). Null for non-numeric loads like bands. |
| unit | String (Optional) | The unit of measure (lbs, kg, damper, level). |
| label | String (Required) | The human-readable string displayed in the UI (e.g., "45 lbs", "Blue Band"). |

## **3\. Specialized Equipment Implementation**

| Equipment Type | Load Object Example | Calculation Use Case   |
| :---- | :---- | :---- |
| **PowerBlocks** | {value: 50, unit: "lbs", label: "50 lbs"} | Total volume (lbs lifted). |
| **Resistance Bands** | {value: null, unit: null, label: "Blue Band"} | Track color usage over time. |
| **Rowing Machine** | {value: 5, unit: "damper", label: "Damper 5"} | Track intensity settings. |

## **4\. High-Precision Protocol Constraints**

For advanced training styles like MSTF, the protocol\_constraints object acts as the execution engine's logic trigger. The tempo field (e.g., "10-2-10-0") should trigger specialized UI timers.

## **5\. Analytics & Progressive Overload**

By capturing the load.value as a number, the application can generate "Progress Charts."

* **Volume Tracking:** Total Volume \= Sets \* Reps \* load.value.  
* **Intensity Tracking:** Monitor the average load.value for a specific exercise ID over a 6-month period.  
* **Auto-Regulation:** If a user notes a set was "Easy," the app can increment the load.value by a predefined step (e.g., \+5) for the next session.

## WorkoutSession Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WorkoutSessionV2",
  "type": "object",
  "required": ["session_id", "metadata", "blocks"],
  "properties": {
    "session_id": { "type": "string" },
    "metadata": {
      "type": "object",
      "required": ["title"],
      "properties": {
        "title": { "type": "string" },
        "environment": { "enum": ["Home", "Gym", "Travel"] },
        "tags": { "type": "array", "items": { "type": "string" } }
      }
    },
    "blocks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["type", "exercises"],
        "properties": {
          "type": { "enum": ["straight", "superset", "circuit", "amrap", "ladder"] },
          "rounds": { "type": "integer", "default": 1 },
          "exercises": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["exercise_id", "name", "prescription"],
              "properties": {
                "exercise_id": { "type": "string" },
                "name": { "type": "string" },
                "prescription": {
                  "type": "object",
                  "required": ["type", "target", "load"],
                  "properties": {
                    "type": { "enum": ["reps", "time", "distance", "failure"] },
                    "target": { "oneOf": [{ "type": "string" }, { "type": "number" }] },
                    "load": {
                      "type": "object",
                      "required": ["label"],
                      "properties": {
                        "value": { "type": ["number", "null"], "description": "Numeric weight for math." },
                        "unit": { "type": ["string", "null"], "description": "lbs, kg, damper, etc." },
                        "label": { "type": "string", "description": "The UI string (e.g., 'Blue Band')." }
                      }
                    }
                  }
                },
                "protocol_constraints": {
                  "type": "object",
                  "properties": {
                    "tempo": { "type": "string", "pattern": "^\\d+-\\d+-\\d+-\\d+$" },
                    "cues": { "type": "array", "items": { "type": "string" } }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```