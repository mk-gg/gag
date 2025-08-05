using System.Text.Json.Serialization;

namespace gag_tracker_backend.Models
{
    public class ApiResponse
    {
        [JsonPropertyName("weather")]
        public WeatherInfo Weather { get; set; } = new WeatherInfo();

        [JsonPropertyName("gear")]
        public List<ApiStockItem> Gear { get; set; } = new List<ApiStockItem>();

        [JsonPropertyName("seeds")]
        public List<ApiStockItem> Seeds { get; set; } = new List<ApiStockItem>();

        [JsonPropertyName("eggs")]
        public List<ApiStockItem> Eggs { get; set; } = new List<ApiStockItem>();

        [JsonPropertyName("honey")]
        public List<ApiStockItem> Honey { get; set; } = new List<ApiStockItem>();

        [JsonPropertyName("cosmetics")]
        public List<ApiStockItem> Cosmetics { get; set; } = new List<ApiStockItem>();

        [JsonPropertyName("timestamp")]
        public long Timestamp { get; set; }

        [JsonPropertyName("weatherHistory")]
        public List<WeatherHistoryItem> WeatherHistory { get; set; } = new List<WeatherHistoryItem>();

        [JsonPropertyName("lastGlobalUpdate")]
        public DateTime LastGlobalUpdate { get; set; }

        [JsonPropertyName("events")]
        public List<ApiStockItem> Events { get; set; } = new List<ApiStockItem>();

        [JsonPropertyName("chrisPCraving")]
        public ChrisPCraving ChrisPCraving { get; set; } = new ChrisPCraving();
    }

    public class WeatherInfo
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;

        [JsonPropertyName("active")]
        public bool Active { get; set; }

        [JsonPropertyName("effects")]
        public List<string> Effects { get; set; } = new List<string>();

        [JsonPropertyName("lastUpdated")]
        public DateTime LastUpdated { get; set; }
    }

    public class WeatherHistoryItem
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;

        [JsonPropertyName("active")]
        public bool Active { get; set; }

        [JsonPropertyName("startTime")]
        public DateTime StartTime { get; set; }

        [JsonPropertyName("endTime")]
        public DateTime EndTime { get; set; }
    }

    public class ChrisPCraving
    {
        [JsonPropertyName("food")]
        public string Food { get; set; } = string.Empty;

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("lastUpdated")]
        public DateTime LastUpdated { get; set; }

        [JsonPropertyName("embedTitle")]
        public string EmbedTitle { get; set; } = string.Empty;

        [JsonPropertyName("embedDescription")]
        public string EmbedDescription { get; set; } = string.Empty;

        [JsonPropertyName("source")]
        public string Source { get; set; } = string.Empty;
    }

    public class ApiStockItem
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("emoji")]
        public string Emoji { get; set; } = string.Empty;

        [JsonPropertyName("available")]
        public bool? Available { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;

        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;

        [JsonPropertyName("lastUpdated")]
        public DateTime? LastUpdated { get; set; }
    }
}
