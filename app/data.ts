import { FunnelStage } from "./type";

export const FunnelData: FunnelStage = {
  id: "total",
  label: "",
  value: 54,
  children: [
    {
      id: "contacted",
      label: "Contacted",
      value: 20,
      children: [
        {
          id: "booked",
          label: "Booked",
          value: 13,
          children: [
            {
              id: "viewing",
              label: "Viewing",
              value: 10,
              children: [
                {
                  id: "visited",
                  label: "Visited",
                  value: 1,
                  children: [
                    {
                      id: "physical_sale",
                      label: "Physical Sale",
                      value: 1,
                    },
                    {
                      id: "ftc",
                      label: "FTC",
                      value: 1,
                    },
                  ],
                },
                {
                  id: "dna",
                  label: "DNA",
                  value: 0,
                },
              ],
            },
            {
              id: "virtual_viewing",
              label: "Virtual Viewing",
              value: 3,
              children: [
                {
                  id: "citnow_complete",
                  label: "Citnow Complete",
                  value: 0,
                  children: [
                    {
                      id: "distance_sale",
                      label: "Distance Sale",
                      value: 0,
                    },
                    {
                      id: "distance_ftc",
                      label: "Distance FTC",
                      value: 0,
                    },
                  ],
                },
                {
                  id: "citnow_pending",
                  label: "Citnow Pending",
                  value: 3,
                },
              ],
            },
          ],
        },
        {
          id: "follow_up_booked",
          label: "Follow Up Booked",
          value: 0,
        },
        {
          id: "no_longer_interested",
          label: "No Longer Interested",
          value: 0,
        },
        {
          id: "needs_to_think",
          label: "Needs to think about it",
          value: 0,
        },
        {
          id: "sent_whatsapp",
          label: "Sent Whatsapp",
          value: 0,
        },
      ],
    },
    {
      id: "not_answered",
      label: "Not Answered",
      value: 14,
    },
    {
      id: "no_attempt",
      label: "No Attempt",
      value: 20,
    },
  ],
};

export const LocalFunnelData: FunnelStage = {
  id: "total",
  label: "",
  value: 11,
  children: [
    {
      id: "contacted",
      label: "Contacted",
      value: 9,
      children: [
        {
          id: "booked",
          label: "Booked",
          value: 6,
          children: [
            {
              id: "viewing",
              label: "Viewing",
              value: 3,
              children: [
                {
                  id: "visited",
                  label: "Visited",
                  value: 2,
                  children: [
                    {
                      id: "physical_sale",
                      label: "Physical Sale",
                      value: 1,
                    },
                    {
                      id: "ftc",
                      label: "FTC",
                      value: 1,
                    },
                  ],
                },
                {
                  id: "dna",
                  label: "DNA",
                  value: 1,
                },
              ],
            },
            {
              id: "virtual_viewing",
              label: "Virtual Viewing",
              value: 3,
              children: [
                {
                  id: "citnow_complete",
                  label: "Citnow Complete",
                  value: 2,
                  children: [
                    {
                      id: "distance_sale",
                      label: "Distance Sale",
                      value: 1,
                    },
                    {
                      id: "distance_ftc",
                      label: "Distance FTC",
                      value: 1,
                    },
                  ],
                },
                {
                  id: "citnow_pending",
                  label: "Citnow Pending",
                  value: 1,
                },
              ],
            },
          ],
        },

        {
          id: "follow_up_booked",
          label: "Follow Up Booked",
          value: 1,
        },
        {
          id: "no_longer_interested",
          label: "No Longer Interested",
          value: 1,
        },
        {
          id: "needs_to_think",
          label: "Needs to think about it",
          value: 1,
        },
        {
          id: "sent_whatsapp",
          label: "Sent Whatsapp",
          value: 1,
        },
      ],
    },

    {
      id: "not_answered",
      label: "Not Answered",
      value: 1,
    },
    {
      id: "no_attempt",
      label: "No Attempt",
      value: 1,
    },
  ],
};