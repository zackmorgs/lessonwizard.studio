using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Host.Endpoints;

// public class SearchEndpoint : Endpoint
// {
//     public SearchEndpoint(HttpClient httpClient) : base(httpClient)
//     {
//     }

//     public async Task<List<SearchResult>> Search(string query)
//     {
//         var request = new HttpRequestMessage(HttpMethod.Get, $"search?query={Uri.EscapeDataString(query)}");
//         request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

//         var response = await _httpClient.SendAsync(request);
//         response.EnsureSuccessStatusCode();

//         var content = await response.Content.ReadAsStringAsync();
//         return JsonSerializer.Deserialize<List<SearchResult>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<SearchResult>();
//     }
// }