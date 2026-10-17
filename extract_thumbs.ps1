[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Editing.MediaClip, Windows.Media.Editing, ContentType = WindowsRuntime] | Out-Null

function Await($task) {
    while (-not $task.IsCompleted -and -not $task.IsFaulted -and -not $task.IsCanceled) {
        [System.Threading.Thread]::Sleep(50)
    }
    if ($task.IsFaulted) { throw $task.Exception }
    return $task.Result
}

$path = "D:\web pro\among us project\among us animation.mp4"
$fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($path)
$file = Await $fileTask
$clipTask = [Windows.Media.Editing.MediaClip]::CreateFromFileAsync($file)
$clip = Await $clipTask

Write-Output "Duration: $($clip.OriginalDuration.TotalSeconds)"

$timePoints = @(5, 15, 30, 45, 60, 90, 120)
foreach ($t in $timePoints) {
    $timeSpan = [System.TimeSpan]::FromSeconds($t)
    $thumbTask = $clip.GetThumbnailAsync($timeSpan, 640, 360, [Windows.Media.Editing.VideoFramePrecision]::NearestFrame)
    $stream = Await $thumbTask
    $outPath = "D:\web pro\among us project\scratch_thumb_$t.jpg"
    $bytes = New-Object byte[] ($stream.Size)
    $reader = New-Object Windows.Storage.Streams.DataReader $stream
    $readTask = $reader.LoadAsync($stream.Size)
    [void](Await $readTask)
    $reader.ReadBytes($bytes)
    [System.IO.File]::WriteAllBytes($outPath, $bytes)
    Write-Output "Saved: $outPath"
}
